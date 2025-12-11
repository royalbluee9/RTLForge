import { Injectable } from '@angular/core';
import { Deliverable } from './hdl-generator.service';

export interface AppState {
  description: string;
  hdlLanguage: 'VHDL' | 'Verilog';
  protocol: string;
  architecture: string;
  simulationTool: string;
  thinkingMode: boolean;
  operationMode: 'generate' | 'explore';
  deliverables: Deliverable[];
}

@Injectable({
  providedIn: 'root',
})
export class PersistenceService {
  private readonly storageKey = 'rtlForgeAppState';

  saveState(state: AppState): void {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem(this.storageKey, serializedState);
    } catch (e) {
      console.error('Error saving state to localStorage', e);
    }
  }

  loadState(): AppState | null {
    try {
      const serializedState = localStorage.getItem(this.storageKey);
      if (serializedState === null) {
        return null;
      }
      return JSON.parse(serializedState) as AppState;
    } catch (e) {
      console.error('Error loading state from localStorage', e);
      return null;
    }
  }
}