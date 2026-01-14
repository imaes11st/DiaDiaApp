export const sumar = (a: number, b: number): number => {
  return a + b;
}   

export const restar = (a: number, b: number): number => {
  return a - b;
}

export const multiplicar = (a: number, b: number): number => {
  return a * b;
}

export const dividir = (a: number, b: number): number => {
  if (b === 0) {
    throw new Error("No se puede dividir por cero");
  }                     
    return a / b;{}
}

export const dobelDe = (a: number): number => {
  return a * 2;
}   

export function ejemploDestructuracionUsuario() {
  const usuario = {
    nombre: "Ana",
    edad: 30
  };

  const { nombre, edad } = usuario;  
    return `Nombre: ${nombre}, Edad: ${edad}`;
}