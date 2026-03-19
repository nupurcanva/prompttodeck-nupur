import { TabItem } from '@components/Objects/BasicTabs';

export interface FilterItem {
  id: string;
  name: string;
}

// Sample items for the tabs
export const tabItems: TabItem[] = [
  { id: 'tab1', name: '' },
  { id: 'tab2', name: '' },
  { id: 'tab3', name: '' },
  { id: 'tab4', name: '' },
];

// Sample items for the recently used section
export const recentlyUsedItems: FilterItem[] = [
  { id: 'recent1', name: 'Recent 1' },
  { id: 'recent2', name: 'Recent 2' },
  { id: 'recent3', name: 'Recent 3' },
  { id: 'recent4', name: 'Recent 4' },
  { id: 'recent5', name: 'Recent 5' },
  { id: 'recent6', name: 'Recent 6' },
  { id: 'recent7', name: 'Recent 7' },
  { id: 'recent8', name: 'Recent 8' },
];

// Sample items for all results
export const allResults: FilterItem[] = [
  { id: 'result1', name: 'Result 1' },
  { id: 'result2', name: 'Result 2' },
  { id: 'result3', name: 'Result 3' },
  { id: 'result4', name: 'Result 4' },
  { id: 'result5', name: 'Result 5' },
  { id: 'result6', name: 'Result 6' },
  { id: 'result7', name: 'Result 7' },
  { id: 'result8', name: 'Result 8' },
];
