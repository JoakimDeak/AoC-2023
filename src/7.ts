const input = await Bun.file('inputs/7.txt').text()

const HAND_TYPES = {
  FIVE_KIND: 7,
  FOUR_KIND: 6,
  FULL_HOUSE: 5,
  THREE_KIND: 4,
  TWO_PAIR: 3,
  ONE_PAIR: 2,
  HIGH_CARD: 1,
} as const

type Card =
  | 'A'
  | 'K'
  | 'Q'
  | 'J'
  | 'T'
  | '9'
  | '8'
  | '7'
  | '6'
  | '5'
  | '4'
  | '3'
  | '2'

const countCards = (hand: string) => {
  const cards = new Map<Card, number>()

  for (let i = 0; i < hand.length; i++) {
    const card = hand[i] as Card
    if (cards.has(card)) {
      cards.set(card, cards.get(card)!!! + 1)
    } else {
      cards.set(card, 1)
    }
  }

  let highestCount = -Infinity
  for (const count of cards.values()) {
    if (count > highestCount) {
      highestCount = count
    }
  }
  return { cards, highestCount }
}

const compareHands = (
  a: string,
  b: string,
  getHandType: (hand: string) => number,
  CARD_VALUES: Record<Card, number>
) => {
  const aType = getHandType(a)
  const bType = getHandType(b)

  if (aType !== bType) {
    return aType < bType ? -1 : aType > bType ? 1 : 0
  }
  for (let i = 0; i < a.length; i++) {
    const aCard = a[i] as Card
    const bCard = b[i] as Card
    if (CARD_VALUES[aCard] !== CARD_VALUES[bCard]) {
      return CARD_VALUES[aCard] < CARD_VALUES[bCard] ? -1 : 1
    }
  }
  return 0
}

const part1 = () => {
  const CARD_VALUES: Record<Card, number> = {
    A: 13,
    K: 12,
    Q: 11,
    J: 10,
    T: 9,
    '9': 8,
    '8': 7,
    '7': 6,
    '6': 5,
    '5': 4,
    '4': 3,
    '3': 2,
    '2': 1,
  }

  const getHandType = (hand: string) => {
    const { cards, highestCount } = countCards(hand)

    switch (cards.size) {
      case 5:
        return HAND_TYPES.HIGH_CARD
      case 4:
        return HAND_TYPES.ONE_PAIR
      case 3:
        return highestCount === 3 ? HAND_TYPES.THREE_KIND : HAND_TYPES.TWO_PAIR
      case 2:
        return highestCount === 4 ? HAND_TYPES.FOUR_KIND : HAND_TYPES.FULL_HOUSE
      case 1:
        return HAND_TYPES.FIVE_KIND
      default:
        throw new Error('scheiße')
    }
  }

  const winnings = input
    .split('\n')
    .map((line) => {
      const [hand, bid] = line.split(' ')
      return { hand, bid: Number(bid) }
    })
    .sort(({ hand: handA }, { hand: handB }) =>
      compareHands(handA, handB, getHandType, CARD_VALUES)
    )
    .reduce((winnings, { bid }, i) => winnings + bid * (i + 1), 0)

  console.log('Part 1:', winnings)
}

const part2 = () => {
  const CARD_VALUES: Record<Card, number> = {
    A: 13,
    K: 12,
    Q: 11,
    T: 10,
    '9': 9,
    '8': 8,
    '7': 7,
    '6': 6,
    '5': 5,
    '4': 4,
    '3': 3,
    '2': 2,
    J: 1,
  }

  const getHandType = (hand: string) => {
    const { cards, highestCount } = countCards(hand)

    if (!cards.has('J')) {
      switch (cards.size) {
        case 5:
          return HAND_TYPES.HIGH_CARD
        case 4:
          return HAND_TYPES.ONE_PAIR
        case 3:
          return highestCount === 3
            ? HAND_TYPES.THREE_KIND
            : HAND_TYPES.TWO_PAIR
        case 2:
          return highestCount === 4
            ? HAND_TYPES.FOUR_KIND
            : HAND_TYPES.FULL_HOUSE
        case 1:
          return HAND_TYPES.FIVE_KIND
        default:
          throw new Error('scheiße')
      }
    }

    switch (cards.size) {
      case 5:
        return HAND_TYPES.ONE_PAIR
      case 4:
        return HAND_TYPES.THREE_KIND
      case 3:
        return highestCount === 3
          ? HAND_TYPES.FOUR_KIND
          : cards.get('J') === 2
          ? HAND_TYPES.FOUR_KIND
          : HAND_TYPES.FULL_HOUSE
      case 2:
      case 1:
        return HAND_TYPES.FIVE_KIND
      default:
        throw new Error('scheiße')
    }
  }

  const winnings = input
    .split('\n')
    .map((line) => {
      const [hand, bid] = line.split(' ')
      return { hand, bid: Number(bid) }
    })
    .sort(({ hand: handA }, { hand: handB }) =>
      compareHands(handA, handB, getHandType, CARD_VALUES)
    )
    .reduce((winnings, { bid }, i) => winnings + bid * (i + 1), 0)

  console.log('Part 2:', winnings)
}

part1()
part2()
