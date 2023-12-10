const input = await Bun.file('inputs/10.txt').text()

type Point = { y: number; x: number }

const getStart = (map: string[][]) => {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === 'S') {
        return { y, x }
      }
    }
  }
  throw new Error('No start')
}

const PIPE_CONNECTIONS = {
  north: ['|', 'L', 'J'],
  east: ['-', 'L', 'F'],
  south: ['|', '7', 'F'],
  west: ['-', 'J', '7'],
}

const getConnections = ({ y, x }: Point, map: string[][]) => {
  const connections: Point[] = []

  if (
    y > 0 &&
    (PIPE_CONNECTIONS.north.includes(map[y][x]) || map[y][x] === 'S') &&
    PIPE_CONNECTIONS.south.includes(map[y - 1][x])
  ) {
    connections.push({ y: y - 1, x })
  }

  if (
    x < map[0].length - 1 &&
    (PIPE_CONNECTIONS.east.includes(map[y][x]) || map[y][x] === 'S') &&
    PIPE_CONNECTIONS.west.includes(map[y][x + 1])
  ) {
    connections.push({ y, x: x + 1 })
  }

  if (
    y < map.length - 1 &&
    (PIPE_CONNECTIONS.south.includes(map[y][x]) || map[y][x] === 'S') &&
    PIPE_CONNECTIONS.north.includes(map[y + 1][x])
  ) {
    connections.push({ y: y + 1, x })
  }

  if (
    x > 0 &&
    (PIPE_CONNECTIONS.west.includes(map[y][x]) || map[y][x] === 'S') &&
    PIPE_CONNECTIONS.east.includes(map[y][x - 1])
  ) {
    connections.push({ y, x: x - 1 })
  }

  return connections
}

const part1 = () => {
  const map = input.split('\n').map((line) => line.split(''))
  const start = getStart(map)

  let [a, b] = getConnections(start, map)
  let steps = 1

  const visitedA = new Set<`${number},${number}`>()
  const visitedB = new Set<`${number},${number}`>()

  do {
    steps++
    visitedA.add(`${a.y},${a.x}`)
    visitedB.add(`${b.y},${b.x}`)

    const connectionsA = getConnections(a, map)
    const connectionsB = getConnections(b, map)

    a = connectionsA.find(
      (connection) => !visitedA.has(`${connection.y},${connection.x}`)
    )!
    b = connectionsB.find(
      (connection) => !visitedB.has(`${connection.y},${connection.x}`)
    )!
  } while (a.y !== b.y || a.x !== b.x)

  console.log('Part 1:', steps)
}

const replaceStart = (map: string[][]) => {
  const start = getStart(map)
  const [a, b] = getConnections(start, map)
  let north = false,
    east = false,
    south = false,
    west = false

  if (a.y < start.y || b.y < start.y) {
    north = true
  }
  if (a.y > start.y || b.y > start.y) {
    south = true
  }
  if (a.x > start.x || b.x > start.x) {
    east = true
  }
  if (a.x < start.x || b.x < start.x) {
    west = true
  }

  switch (true) {
    case north && east:
      map[start.y][start.x] = 'L'
      break
    case north && south:
      map[start.y][start.x] = '|'
      break
    case north && west:
      map[start.y][start.x] = 'J'
      break
    case east && south:
      map[start.y][start.x] = 'F'
      break
    case east && west:
      map[start.y][start.x] = '-'
      break
    case south && west:
      map[start.y][start.x] = '7'
      break
  }
}

const part2 = () => {
  const map = input.split('\n').map((line) => line.split(''))
  const start = getStart(map)
  replaceStart(map)

  const loopPipes = new Set<`${number},${number}`>()

  let pos = { ...start }

  do {
    loopPipes.add(`${pos.y},${pos.x}`)

    const connectionsA = getConnections(pos, map)

    pos = connectionsA.find((c) => !loopPipes.has(`${c.y},${c.x}`))!
  } while (!!pos)

  let insideArea = 0
  let isInside = false
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (loopPipes.has(`${y},${x}`)) {
        if (PIPE_CONNECTIONS.south.includes(map[y][x])) {
          isInside = !isInside
        }
      } else if (isInside) {
        insideArea++
      }
    }
  }

  console.log('Part 2:', insideArea)
}

part1()
part2()
