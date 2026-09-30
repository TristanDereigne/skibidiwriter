export { cn } from "cn";

const replaceAt = (str:string, index: number, char: string)=> {
    if (index < 0 || index >= str.length) return str;
    let a = str.split("");
    a[index] = char;
    return a.join("");
}

export const formateDate = (date: Date) => {
    let monthYearDate = date.toLocaleString('fr-FR', { month: 'long'})+" "+date.getFullYear()
    monthYearDate = replaceAt(monthYearDate, 0 , monthYearDate[0].toUpperCase())
    return monthYearDate;
}