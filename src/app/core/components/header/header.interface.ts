export interface navBar { 
    logo:  string;
    navLinks: Array<navType>;
}

interface navType {
    id: number;
    title: string;
    path: string;
}