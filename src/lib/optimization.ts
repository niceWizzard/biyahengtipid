import { LocalTripStop } from "@/app/(main)/trip/[id]/_components/TripStopItem";

const OPTIMIZATION_URL = 'https://api.openrouteservice.org/optimization';
const API_KEY = process.env.ORS_API_KEY;

export interface VroomJob {
    id: number;
    location: [number, number];
}

async function vroomOptimize(
    jobs: VroomJob[],
    startLoc?: [number, number],
    endLoc?: [number, number],
    profile: string = 'driving-car',
): Promise<{
    steps: {
        id: string;
        latitude: number;
        longitude: number;
    }[];
    totalDistance: number;
}> {
    if(!API_KEY) {
        throw new Error('ORS_API_KEY is not defined');
    }
    if(!jobs) {
        throw new Error('Jobs is not defined');
    }
    const vehicle: any = {
        id: 1,
        profile,
    };
    if (startLoc) vehicle.start = startLoc;
    if (endLoc) vehicle.end = endLoc;

    const requestBody = {
        jobs,
        vehicles: [vehicle]
    };

    const response = await fetch(OPTIMIZATION_URL, {
        method: 'POST', 
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        console.error(await response.text());
        throw new Error('Failed to fetch optimized trip stops');
    }

    const resJson = await response.json();

    if(resJson.code !== 0 && resJson.code !== undefined){
        throw new Error("Failed to optimize trip stops: " + resJson.error);
    }

    if(!resJson.routes?.length) {
        throw new Error("No routes found");
    }

    const route = resJson.routes[0];
    const jobSteps = route.steps.filter((step: any) => step.type === 'job');
    const steps = jobSteps.map((step: any) => ({
        id: step.id.toString(),
        latitude: step.location[1],
        longitude: step.location[0],
    }));
    
    return {
        steps,
        totalDistance: route.cost,
    };
}


export async function optimizeTripStops(
    stops: LocalTripStop[],
    profile: string = 'driving-car',
    options: { lockStart?: boolean; lockEnd?: boolean } = { lockStart: true, lockEnd: true }
) {
    if(stops.length <= 2) {
        return stops;
    }

    const { lockStart = true, lockEnd = true } = options;
    if (!lockStart && !lockEnd) {
        throw new Error("At least one of lockStart or lockEnd must be true");
    }

    let startStop: LocalTripStop | undefined;
    let endStop: LocalTripStop | undefined;
    let middleStops: LocalTripStop[] = [];

    if (lockStart && lockEnd) {
        startStop = stops[0];
        endStop = stops[stops.length - 1];
        middleStops = stops.slice(1, -1);
    } else if (lockStart && !lockEnd) {
        startStop = stops[0];
        middleStops = stops.slice(1);
    } else if (!lockStart && lockEnd) {
        endStop = stops[stops.length - 1];
        middleStops = stops.slice(0, -1);
    }

    const idMap = new Map<string, string>();
    const jobs = middleStops.map((stop, index) => {
        idMap.set(index.toString(), stop.id);
        return {
            id: index,
            location: [stop.longitude, stop.latitude] as [number, number],
        };
    });

    const optimizedResult = await vroomOptimize(
        jobs,
        startStop ? [startStop.longitude, startStop.latitude] : undefined,
        endStop ? [endStop.longitude, endStop.latitude] : undefined,
        profile
    );

    const optimizedMiddleStops = optimizedResult.steps.map((step) => {
        const originalId = idMap.get(step.id);
        const localStop = stops.find((stop) => stop.id === originalId);
        if(localStop) {
            return {
                ...localStop,
                latitude: step.latitude,
                longitude: step.longitude,
            };
        }
        throw new Error(`No job id found on the step with id: ${step.id}`)
    });
    
    const result = [];
    if (lockStart && startStop) result.push(startStop);
    result.push(...optimizedMiddleStops);
    if (lockEnd && endStop) result.push(endStop);

    return result;
}