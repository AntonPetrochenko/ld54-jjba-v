export interface Character {
  name: string
  image: string
  firesound: string
}

const characters: Character[] = [
  {
    name: "JONNY",
    image: "/soldat.png",
    firesound: "/shoot.mp3"
  },
  {
    name: "VSRATOSLAV",
    image: "/rus.png",
    firesound: "/bow.mp3"
  }
]

export {characters}