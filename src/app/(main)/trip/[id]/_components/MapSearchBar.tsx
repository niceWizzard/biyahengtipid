import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Clock, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface Place {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
}

// Emulate an API search
const MOCK_PLACES: Place[] = [
  {
    id: '1',
    name: 'Manila Cathedral',
    latitude: 14.5916,
    longitude: 120.9735,
    address: 'Intramuros, Manila',
  },
  {
    id: '2',
    name: 'Rizal Park',
    latitude: 14.5826,
    longitude: 120.9787,
    address: 'Ermita, Manila',
  },
  {
    id: '3',
    name: 'Fort Santiago',
    latitude: 14.5941,
    longitude: 120.9703,
    address: 'Intramuros, Manila',
  },
  {
    id: '4',
    name: 'San Agustin Church',
    latitude: 14.5888,
    longitude: 120.975,
    address: 'Intramuros, Manila',
  },
  {
    id: '5',
    name: 'National Museum of Fine Arts',
    latitude: 14.5869,
    longitude: 120.9812,
    address: 'Ermita, Manila',
  },
  {
    id: '6',
    name: 'BGC High Street',
    latitude: 14.5516,
    longitude: 121.0503,
    address: 'Taguig, Metro Manila',
  },
  {
    id: '7',
    name: 'Mall of Asia',
    latitude: 14.535,
    longitude: 120.9822,
    address: 'Pasay City',
  },
];

const mockSearch = async (query: string): Promise<Place[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!query.trim()) {
        resolve([]);
        return;
      }
      const q = query.toLowerCase();
      const results = MOCK_PLACES.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.address?.toLowerCase().includes(q)
      );
      resolve(results);
    }, 500); // 500ms delay to emulate network
  });
};

export default function MapSearchBar({
  onSelect,
}: {
  onSelect: (place: Place) => void;
}) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<Place[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // load recent searches from localstorage
    try {
      const stored = localStorage.getItem('recentSearches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const saveRecentSearch = (place: Place) => {
    const updated = [
      place,
      ...recentSearches.filter((p) => p.id !== place.id),
    ].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch (e) {}
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    let active = true;

    const timer = setTimeout(async () => {
      const res = await mockSearch(query);
      if (active) {
        setResults(res);
        setIsLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  const handleSelect = (place: Place) => {
    onSelect(place);
    saveRecentSearch(place);
    setQuery('');
    setIsFocused(false);
  };

  const showSuggestions =
    isFocused && (query.trim().length > 0 ? true : recentSearches.length > 0);

  return (
    <div
      ref={wrapperRef}
      className="absolute top-0 py-8 left-1/2 max-w-full -translate-x-1/2 sm:left-6 sm:translate-x-0"
      style={{zIndex: 1000}}
    >
      <div className="relative flex items-center w-full ">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search places..."
          className="bg-background dark:bg-background border-border/50 h-12 w-full rounded-full shadow-lg backdrop-blur-md transition-all focus-visible:ring-1 focus-visible:ring-offset-0"
          size={32}
        />
        {query ? (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground absolute right-2  h-10 w-10 hover:bg-transparent"
            onClick={() => {
              setQuery('');
              setIsFocused(true);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        ) : (
        <Search className="text-muted-foreground absolute right-2  h-5 w-5" />

        )}
      </div>

      {showSuggestions && (
        <div className="bg-background border-border/50 animate-in fade-in slide-in-from-top-2 absolute left-0 w-full overflow-hidden rounded-2xl border shadow-xl backdrop-blur-md">
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {!query.trim() && recentSearches.length > 0 && (
              <div className="mb-2">
                <div className="text-muted-foreground mb-1 px-3 py-1 text-xs font-semibold tracking-wider uppercase">
                  Recent Searches
                </div>
                {recentSearches.map((place) => (
                  <button
                    key={place.id}
                    onClick={() => handleSelect(place)}
                    className="hover:bg-muted cursor-pointer flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors"
                  >
                    <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                      <Clock className="text-muted-foreground h-4 w-4" />
                    </div>
                    <div className="flex-1 truncate">
                      <div className="text-sm font-medium">{place.name}</div>
                      {place.address && (
                        <div className="text-muted-foreground truncate text-xs">
                          {place.address}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {query.trim() && (
              <div>
                {isLoading ? (
                  <div className="text-muted-foreground flex items-center justify-center py-6 text-sm">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </div>
                ) : results.length > 0 ? (
                  <>
                    <div className="text-muted-foreground mb-1 px-3 py-1 text-xs font-semibold tracking-wider uppercase">
                      Suggestions
                    </div>
                    {results.map((place) => (
                      <button
                        key={place.id}
                        onClick={() => handleSelect(place)}
                        className="hover:bg-muted cursor-pointer flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors"
                      >
                        <div className="bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                          <MapPin className="text-primary h-4 w-4" />
                        </div>
                        <div className="flex-1 truncate">
                          <div className="text-sm font-medium">
                            {place.name}
                          </div>
                          {place.address && (
                            <div className="text-muted-foreground truncate text-xs">
                              {place.address}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </>
                ) : (
                  <div className="text-muted-foreground py-6 text-center text-sm">
                    No results found for "{query}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
