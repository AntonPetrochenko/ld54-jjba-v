/// <reference types="vite/client" />


interface Window {
  spam: any; // Use the desired type for the 'spam' property
}
interface HTMLDivElement {
  posX: number | undefined,
  posY: number | undefined
}