import { IMenuGroups } from '../interfaces/main.interface';
import { urlConfig } from '../interfaces/dynamicUrl.interface';
import * as footerData from 'src/assets/data/footer.json' 

export const footerConfig: IMenuGroups [] = footerData;

export const baseUrl: urlConfig = {
        mainUrl: 'http://35.224.252.52:8080/v3/config/getHeader'
}