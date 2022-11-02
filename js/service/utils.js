export const utils = {
    getId
}

function getId(){
    let str = '1234567890abcdefghijkmlnopqrs'
    let id = ''
    for (let i = 0; i < 5; i++) {
        id += str[getRandomInt(0, str.length)]
    }
    return id
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min)
  }