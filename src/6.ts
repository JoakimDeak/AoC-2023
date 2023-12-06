const input = await Bun.file('inputs/6.txt').text()

const part1 = () => {
  const [times, records] = input
    .split('\n')
    .map((line) => line.split(' ').filter(Boolean).slice(1).map(Number))

  const races = times.reduce((races, time, i) => {
    races.push({ time, record: records[i] })
    return races
  }, [] as { time: number; record: number }[])

  const product = races.reduce((product, { time, record }) => {
    let min = Infinity
    let max = -Infinity

    for (let i = 0; i < time / 2; i++) {
      if (i * (time - i) > record) {
        min = i
        break
      }
    }

    for (let i = time; i >= time / 2; i--) {
      if (i * (time - i) > record) {
        max = i
        break
      }
    }

    return product * (max - min + 1)
  }, 1)

  console.log('Part 1:', product)
}

const part2 = () => {
  const [time, record] = input
    .split('\n')
    .map((line) => Number(line.split(':')[1].replaceAll(' ', '')))

  let min = Infinity
  let max = -Infinity

  for (let i = 0; i < time / 2; i++) {
    if (i * (time - i) > record) {
      min = i
      break
    }
  }

  for (let i = time; i >= time / 2; i--) {
    if (i * (time - i) > record) {
      max = i
      break
    }
  }

  const totalWays = max - min + 1

  console.log('Part 2:', totalWays)
}

part1()
part2()
