const input = await Bun.file('inputs/9.txt').text()
const histories = input.split('\n').map((line) => line.split(' ').map(Number))

const part1 = () => {
  const sum = histories.reduce((sum, history) => {
    const differences: number[][] = []
    differences.push(history)

    let nextNumber = history.at(-1) as number

    let j = 0
    while (differences.at(-1)?.some((num) => num !== 0)) {
      const diffs = differences[j].reduce((diffs, number, i, difference) => {
        if (i !== 0) {
          diffs.push(number - difference[i - 1])
        }
        if (i === difference.length - 1) {
          nextNumber += number - difference[i - 1]
        }
        return diffs
      }, [] as number[])
      differences.push(diffs)
      j++
    }

    return sum + nextNumber
  }, 0)

  console.log('Part 1:', sum)
}

const part2 = () => {
  const sum = histories.reduce((sum, history) => {
    const differences: number[][] = []
    differences.push(history)

    let j = 0
    while (differences.at(-1)?.some((num) => num !== 0)) {
      const diffs = differences[j].reduce((diffs, number, i, difference) => {
        if (i !== 0) {
          diffs.push(number - difference[i - 1])
        }
        return diffs
      }, [] as number[])
      differences.push(diffs)
      j++
    }

    let prevNumber = 0
    for (let i = differences.length - 2; i >= 0; i--) {
      prevNumber = differences[i][0] - prevNumber
    }

    return sum + prevNumber
  }, 0)

  console.log('Part 2:', sum)
}

part1()
part2()
