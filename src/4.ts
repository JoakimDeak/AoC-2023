const input = await Bun.file('inputs/4.txt').text()

type Card = { number: number; winning: number[]; numbers: number[] }

const cards = input.split('\n').reduce((cards, _line) => {
  const line = _line.replace(/\s{2,}/g, ' ')
  const [_cardNumber, numbersSet] = line.split(':')

  const [_, cardNumber] = _cardNumber.split(' ')

  const [numbers, winning] = numbersSet
    .split('|')
    .map((part) => part.trim().split(' '))
    .map((set) => set.map(Number))

  cards.push({
    number: Number(cardNumber),
    winning,
    numbers,
  })

  return cards
}, [] as Card[])

const part1 = () => {
  const points = cards.reduce((sum, { winning, numbers }) => {
    const winningNumbers = numbers.reduce((count, number) => {
      if (winning.includes(number)) {
        return count + 1
      }

      return count
    }, 0)

    return sum + Math.floor(Math.pow(2, winningNumbers - 1))
  }, 0)

  console.log('Part 1:', points)
}

const part2 = () => {
  const cardCounts: Record<number, number> = {}
  cards.forEach(({ number }) => {
    if (number in cardCounts) {
      cardCounts[number] += 1
    } else {
      cardCounts[number] = 1
    }
  })

  const cardWins: Record<number, number> = {}
  const process = ({ number: cardNumber, winning, numbers }: Card) => {
    const winningNumbers =
      cardWins[cardNumber] !== undefined
        ? cardWins[cardNumber]
        : numbers.reduce((count, number) => {
            if (winning.includes(number)) {
              return count + 1
            }
            return count
          }, 0)

    if (cardWins[cardNumber] === undefined) {
      cardWins[cardNumber] = winningNumbers
    }

    for (let i = 1; i <= winningNumbers; i++) {
      cardCounts[cardNumber + i] += 1
    }
  }

  for (let i = 0; i < cards.length; i++) {
    for (let j = 0; j < cardCounts[i + 1]; j++) {
      process(cards[i])
    }
  }

  const totalCards = Object.values(cardCounts).reduce(
    (sum, cardCount) => sum + cardCount,
    0
  )

  console.log('Part 2:', totalCards)
}

part1()
part2()
