import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

export default function testTableActions({ useStore }) {
  describe('table actions', () => {
    let store;

    beforeEach(() => {
      setActivePinia(createPinia());
  
      store = useStore();
    });
    
    it('should indicate deletion when delete table action is selected', async () => {
      const id = 'some_id'
      const action = 'delete';
  
      const result = await store.onTableAction({ id, action });
  
      expect(result).toEqual({
        id,
        delete: true
      }); 
    })
  })
}