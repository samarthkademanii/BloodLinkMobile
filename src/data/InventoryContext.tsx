import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { bloodTypes, initialInventory, type BloodType, type InventoryEntry } from './mockData';
import { apiGet } from './api';

type Inventory = Record<BloodType, InventoryEntry>;

const InventoryCtx = createContext<{ inventory: Inventory; connected: boolean }>({
  inventory: initialInventory,
  connected: false,
});

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [inventory, setInventory] = useState<Inventory>(() => clone(initialInventory));
  const [connected, setConnected] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    async function poll() {
      try {
        const live = await apiGet<Inventory>('/inventory');
        if (mounted.current) {
          setInventory(live);
          setConnected(true);
        }
      } catch {
        // Backend unreachable — keep showing the last known values and
        // nudge them with a local simulation so the demo still feels alive.
        if (mounted.current) {
          setConnected(false);
          setInventory((prev) => {
            const next = clone(prev);
            bloodTypes.forEach((t) => {
              const delta = Math.floor(Math.random() * 5) - 2;
              next[t].units = Math.max(0, Math.min(next[t].max, next[t].units + delta));
            });
            return next;
          });
        }
      }
    }

    poll();
    const id = setInterval(poll, 3500);
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, []);

  return <InventoryCtx.Provider value={{ inventory, connected }}>{children}</InventoryCtx.Provider>;
}

function clone(inv: Inventory): Inventory {
  const out = {} as Inventory;
  bloodTypes.forEach((t) => {
    out[t] = { ...inv[t] };
  });
  return out;
}

export function useInventory() {
  return useContext(InventoryCtx).inventory;
}

export function useBackendConnected() {
  return useContext(InventoryCtx).connected;
}

export function totalUnits(inventory: Inventory) {
  return bloodTypes.reduce((sum, t) => sum + inventory[t].units, 0);
}
