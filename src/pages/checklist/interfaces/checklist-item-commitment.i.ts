import { IChecklistItem } from '../';

/**
 * Checklist item commitment interface.
 * 
 * @author Caio Frota <contato@caiofrota.com.br>
 * @version 1.0
 */
export interface IChecklistItemCommitment extends IChecklistItem {
    date?: Date;
}
