import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

export default function testTableActions({ id, useStore }) {
  describe('table actions', () => {
    let store;

    beforeEach(() => {
      setActivePinia(createPinia());
  
      store = useStore();
    });
    
    it('should indicate deletion when delete table action is selected', async () => {
      const action = 'delete';
  
      const result = await store.onTableAction({ id, action });
  
      expect(result).toEqual({
        id,
        delete: true
      }); 
    })
  })
}