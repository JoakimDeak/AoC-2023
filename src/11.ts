const input = await Bun.file('inputs/11.txt').text()

const solve = (growthMultiplier: number) => {
  const map = input.split('\n').map((line) => line.split(''))

  const emptyColumnBools = Array.from({ length: map[0].length }).map(() => true)

  const emptyRows = map.reduce((emptyRows, row, i) => {
    let rowHasGalaxy = false

    for (let j = 0; j < row.length; j++) {
      if (row[j] === '#') {
        rowHasGalaxy = true
        emptyColumnBools[j] = false
      }
    }

    if (!rowHasGalaxy) {
      emptyRows.push(i)
    }

    return emptyRows
  }, [] as number[])

  const emptyColumns = emptyColumnBools
    .map((el, i) => (el ? i : undefined))
    .filter(Boolean)

  const galaxies: { x: number; y: number }[] = []
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === '#') {
        galaxies.push({ y, x })
      }
    }
  }

  let distSum = 0
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = 0; j < i; j++) {
      const { x: xA, y: yA } = galaxies[i]
      const { x: xB, y: yB } = galaxies[j]

      const extraCols =
        emptyColumns.filter(
          (col) => col < Math.max(xA, xB) && col > Math.min(xA, xB)
        ).length *
        (growthMultiplier - 1)

      const extraRows =
        emptyRows.filter(
          (row) => row < Math.max(yA, yB) && row > Math.min(yA, yB)
        ).length *
        (growthMultiplier - 1)

      distSum += Math.abs(xA - xB) + Math.abs(yA - yB) + extraCols + extraRows
    }
  }

  return distSum
}

const part1 = () => {
  const res = solve(2)
  console.log('Part 1:', res)
}

const part2 = () => {
  const res = solve(1000000)
  console.log('Part 2:', res)
}

part1()
part2()
