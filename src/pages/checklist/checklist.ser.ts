import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { IChecklist, IChecklistItem, EChecklistType } from './'

/**
 * Checklist Service.
 * 
 * @author Caio Frota <contato@caiofrota.com.br>
 * @version 1.0
 */
@Injectable()
export class ChecklistService {
    /**
     * Constructor.
     * 
     * @param AngularFireDatabase _firebase Firebase database.
     */
    constructor(private _firebase: AngularFireDatabase) {
        // Do nothing.
    }
    
    /**
     * Get checklist.
     * 
     * @param string key Checklist key.
     * @return FirebaseObjectObservable<any> Checklist observable.
     */
    public getChecklist(key: string): FirebaseObjectObservable<IChecklist> {
        return this._firebase.object('/checklists/' + key);
    }

    /**
     * Create a checklist.
     * 
     * Return FirebaseObjectObservable<IChecklist> when success.
     * Return any when error.
     * 
     * @param string checklistName Checklist name.
     * @param EChecklist type? List type.
     * @param boolean permanent If true, this list won't be removed.
     * @return any Observable.
     */
    public createChecklist(checklistName: string, type?: EChecklistType, permanent?: boolean): any {
        this.clearOldestChecklists();
        let listData: IChecklist = {
            name: checklistName,
            permanent: ((permanent) ? true : false),
            type: ((type) ? type : null),
            items: [],
            created_on: new Date().getTime(),
            updated_on: new Date().getTime(),
            last_access_on: new Date().getTime()
        };
        return Observable.create((observer: any) => {
            this._firebase.list('/checklists').push(listData).then(
                (item: any) => {
                    observer.next(this._firebase.object('/checklists/' + item.key));
                    observer.complete();
                },
                (error: any) => {
                    observer.error(error);
                }
            );
        }); 
    }

    /**
     * Remove non-permanent oldest lists.
     * 
     * Greater than 7 days.
     */
    public clearOldestChecklists(): void {
        // Find lists greated than 7 days.
        this._firebase.list('/checklists', {
            query: {
                endAt: (new Date().getTime() - (54*7*24*60*60*1000)), // 1 year.
                orderByChild: 'last_access_on'
            }
        }).subscribe((items: Array<IChecklist>) => {
            // Make sure the lists are non-permanents and remove them.
            for(let i in items) {
                if (!items[i].permanent) {
                    this._firebase.list('/checklists/' + items[i]['$key']).remove();
                }
            };
        });
    }

    /**
     * Get checklist items.
     * 
     * @param FarebaseObjectObservable<IChecklist> item Checklist key.
     * @return FirebaseListObservable<IChecklistItem> Checklist observable.
     */
    public getChecklistItems(item: FirebaseObjectObservable<IChecklist>): FirebaseListObservable<any> {
        item.$ref.child('last_access_on').set(new Date().getTime()).then((data: any) => {});
        return this._firebase.list('/checklists/' + item.$ref.key + '/items');
    }

    /**
     * Add a item into list.
     * 
     * Return IChecklistItem when success.
     * Return any when error.
     * 
     * @param key List key.
     * @param item Item to be added.
     * @return any Observable.
     */
    public addChecklistItem(key: string, item: string): any {
        let listItemData: IChecklistItem = {
            name: item,
            checked: false
        }
        return Observable.create((observer: any) => {
            this._firebase.list('/checklists/' + key + '/items').push(listItemData).then(
                (item: any) => {
                    observer.next(listItemData);
                    observer.complete();
                },
                (error: any) => {
                    observer.error(error);
                }
            );
        }); 
    }

    /**
     * Update checklist item.
     * 
     * @param string checklistKey Checklist key.
     * @param IChecklistItem checklistItem Item to be updated.
     */
    public updateChecklistItem(checklistKey: string, checklistItem: IChecklistItem): void {
        this._firebase.object('/checklists/' + checklistKey + '/items/' + checklistItem['$key']).set(checklistItem);
    }

    /**
     * Remove checklist item.
     * 
     * @param string checklistKey Checklist key.
     * @param string itemKey Item key.
     */
    public removeChecklistItem(checklistKey: string, itemKey: string): void {
        this._firebase.list('/checklists/' + checklistKey + '/items/' + itemKey).remove();
    }

    /**
     * Remove all checklist items.
     * 
     * @param string checklistKey Checklist key.
     * @param string itemKey Item key.
     * @param any Firebase promise.
     */
    public removeChecklistItems(checklistKey: string): any {
        return this._firebase.object('/checklists/' + checklistKey + '/items').set([]);
    }
}
