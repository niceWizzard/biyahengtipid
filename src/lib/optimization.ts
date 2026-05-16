import { LocalTripStop } from "@/app/(main)/trip/[id]/_components/TripStopItem";

const OPTIMIZATION_URL = 'https://api.openrouteservice.org/optimization';
const API_KEY = process.env.ORS_API_KEY;

export interface VroomJob {
    id: number;
    location: [number, number];
}

async function vroomOptimize(
    jobs: VroomJob[],
    startLoc: [number, number],
    endLoc: [number, number],
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
    const requestBody = {
        jobs,
        vehicles: [
            {
                id: 1,
                profile,
                start: startLoc,
                end: endLoc,
            }
        ]
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
    const steps = route.steps.slice(1,-1).map((step: any) => ({
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
) {
    if(stops.length <= 2) {
        return stops;
    }

    const startStop = stops[0];
    const endStop = stops[stops.length - 1];
    const middleStops = stops.slice(1, -1);

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
        [startStop.longitude, startStop.latitude],
        [endStop.longitude, endStop.latitude],
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
    
    return [startStop, ...optimizedMiddleStops, endStop];
}