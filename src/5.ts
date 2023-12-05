const input = await Bun.file('inputs/5.txt').text()

const part1 = () => {
  const [_seeds, ..._maps] = input.split('\n\n')
  const seeds = _seeds.split(': ')[1].split(' ').map(Number)
  const maps = _maps
    .map((map) => map.split('\n').slice(1))
    .map((map) =>
      map.map((range) => {
        const [destinationStart, sourceStart, rangeLength] = range
          .split(' ')
          .map(Number)
        return { destinationStart, sourceStart, rangeLength }
      })
    )

  const minLocation = seeds.reduce((minLocation, seedNumber) => {
    let converted = seedNumber

    for (let i = 0; i < maps.length; i++) {
      const currentMap = maps[i]

      for (let j = 0; j < currentMap.length; j++) {
        const { destinationStart, sourceStart, rangeLength } = currentMap[j]
        if (converted >= sourceStart && converted < sourceStart + rangeLength) {
          converted = converted - (sourceStart - destinationStart)
          break
        }
      }
    }

    return Math.min(minLocation, converted)
  }, Infinity)

  console.log('Part 1:', minLocation)
}

const part2 = () => {
  const [_seedRanges, ..._maps] = input.split('\n\n')
  const seedRanges = _seedRanges.split(': ')[1].split(' ').map(Number)

  const maps = _maps
    .map((map) => map.split('\n').slice(1))
    .map((map) =>
      map.map((range) => {
        const [destinationStart, sourceStart, rangeLength] = range
          .split(' ')
          .map(Number)
        return { destinationStart, sourceStart, rangeLength }
      })
    )

  let minLocation = Infinity

  // this works but is dreadfully slow
  for (let i = 0; i < seedRanges.length; i += 2) {
    const rangeStart = seedRanges[i]
    const rangeLength = seedRanges[i + 1]

    for (let j = rangeStart; j < rangeStart + rangeLength; j++) {
      let converted = j
      for (let k = 0; k < maps.length; k++) {
        for (let l = 0; l < maps[k].length; l++) {
          if (
            converted >= maps[k][l].sourceStart &&
            converted < maps[k][l].sourceStart + maps[k][l].rangeLength
          ) {
            converted =
              converted - (maps[k][l].sourceStart - maps[k][l].destinationStart)
            break
          }
        }
      }
      if (converted < minLocation) {
        minLocation = converted
      }
    }
  }

  console.log('Part 2:', minLocation)
}

part1()
part2()
