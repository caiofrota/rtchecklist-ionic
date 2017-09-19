import { Injectable } from '@angular/core';

/**
 * Checklist Storage Service.
 * 
 * @author Caio Frota <contato@caiofrota.com.br>
 * @version 1.0
 */
@Injectable()
export class ChecklistStorageService {
    // Constants.
    private LOCAL_STORAGE_LISTKEYS = 'fd.checklists';

    /**
     * Get checklists keys from LocalStorage.
     * 
     * @return Array<string> Checklist keys.
     */
    public getChecklistsKeys(): Array<string> {
        if (!localStorage.getItem(this.LOCAL_STORAGE_LISTKEYS)) {
            localStorage.setItem(this.LOCAL_STORAGE_LISTKEYS, '[]');
        }
        return JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_LISTKEYS));
    }

    /**
     * Update checklists keys.
     * 
     * @param Array<string> keys Key array.
     */
    public updateChecklistsKeys(keys: Array<string>) {
        localStorage.setItem(this.LOCAL_STORAGE_LISTKEYS, JSON.stringify(keys));
    } 

    /**
     * Add checklist in LocalStorage.
     * 
     * @param string key Key.
     */
    public addChecklistKey(key: string): void {
        if (key) {
            if (!this.existsKey(key)) {
                let keys = this.getChecklistsKeys();
                keys.push(key);
                this.updateChecklistsKeys(keys);
            }
        }
    }

    /**
     * Remove checklist from LocalStorage.
     * 
     * @param string key Key.
     */
    public removeChecklistKey(key: string): void {
        let keys: Array<string> = this.getChecklistsKeys();
        let i: number = keys.indexOf(key);
        if (i >= 0) {
            keys.splice(i, 1);
            this.updateChecklistsKeys(keys);
        }
    }

    /**
     * Check if key exists in LocalStorage.
     * 
     * @param string key Key to search.
     * @return boolean TRUE if exist.
     */
    public existsKey(key: string): boolean {
        return (this.getChecklistsKeys().indexOf(key) >= 0);
    }
}
