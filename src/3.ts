const input = await Bun.file('inputs/3.txt').text()
const schematic = input.split('\n')

const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const

const parts = schematic.reduce((parts, line, row) => {
  const isDigit = (s: string | undefined) =>
    s !== undefined && digits.includes(s)

  let number = ''
  let start = -1
  for (let i = 0; i < line.length; i++) {
    if (isDigit(line[i])) {
      if (!number) {
        start = i
      }
      number += line[i]
    } else {
      if (!!number) {
        parts.push({
          number: Number(number),
          start,
          end: i - 1,
          row,
        })
        number = ''
        start = -1
      }
    }
  }

  if (!!number) {
    parts.push({
      number: Number(number),
      start,
      end: line.length - 1,
      row: row,
    })
  }

  return parts
}, [] as Record<'number' | 'row' | 'start' | 'end', number>[])

const part1 = () => {
  const isSymbol = (s: string | undefined) =>
    s !== undefined && !digits.includes(s) && s !== '.'

  const sum = parts.reduce((sum, { number, row, start, end }) => {
    if (row > 0) {
      for (let i = Math.max(start - 1, 0); i < end + 2; i++) {
        if (isSymbol(schematic[row - 1].at(i))) {
          return sum + number
        }
      }
    }
    if (start > 0) {
      if (isSymbol(schematic[row].at(start - 1))) {
        return sum + number
      }
    }
    if (isSymbol(schematic[row].at(end + 1))) {
      return sum + number
    }
    if (row < schematic.length - 1) {
      for (let i = Math.max(start - 1, 0); i < end + 2; i++) {
        if (isSymbol(schematic[row + 1].at(i))) {
          return sum + number
        }
      }
    }

    return sum
  }, 0)

  console.log('Part 1:', sum)
}

const part2 = () => {
  type Gear = `${number},${number}`

  const isGear = (s: string | undefined) => s === '*'

  const map = parts.reduce((map, { number, row, start, end }) => {
    const gears: Gear[] = []

    if (row > 0) {
      for (let i = Math.max(start - 1, 0); i < end + 2; i++) {
        if (isGear(schematic[row - 1].at(i))) {
          gears.push(`${row - 1},${i}`)
        }
      }
    }
    if (start > 0) {
      if (isGear(schematic[row].at(start - 1))) {
        gears.push(`${row},${start - 1}`)
      }
    }
    if (isGear(schematic[row].at(end + 1))) {
      gears.push(`${row},${end + 1}`)
    }
    if (row < schematic.length - 1) {
      for (let i = Math.max(start - 1, 0); i < end + 2; i++) {
        if (isGear(schematic[row + 1].at(i))) {
          gears.push(`${row + 1},${i}`)
        }
      }
    }

    gears.forEach((gear) => {
      if (gear in map) {
        map[gear].push(number)
      } else {
        map[gear] = [number]
      }
    })

    return map
  }, {} as Record<Gear, number[]>)

  const ratio = Object.values(map).reduce((sum, parts) => {
    if (parts.length === 2) {
      return sum + parts[0] * parts[1]
    }

    return sum
  }, 0)

  console.log('Part 2:', ratio)
}

part1()
part2()
