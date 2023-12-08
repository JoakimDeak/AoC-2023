const input = await Bun.file('inputs/8.txt').text()

const [steps, ...nodes] = input.replaceAll(' ', '').split('\n').filter(Boolean)
const map = nodes.reduce((nodeMap, line) => {
  const [node, leftRight] = line.split('=')
  const [left, right] = leftRight.slice(1, -1).split(',')
  nodeMap[node] = { left, right }

  return nodeMap
}, {} as Record<string, { left: string; right: string }>)

const part1 = () => {
  let currNode = 'AAA'
  let step = 0
  while (currNode !== 'ZZZ') {
    currNode =
      steps[step % steps.length] === 'L'
        ? map[currNode].left
        : map[currNode].right
    step++
  }

  console.log('Part 1:', step)
}

const greatestCommonDivisor = (a: number, b: number): number =>
  a ? greatestCommonDivisor(b % a, a) : b

const lowestCommonDivisor = (a: number, b: number) =>
  (a * b) / greatestCommonDivisor(a, b)

const part2 = () => {
  let currNodes = Object.keys(map).filter((node) => node.charAt(2) === 'A')

  const stepsNeeded = currNodes.map((node) => {
    let step = 0
    let currNode = node
    while (currNode.charAt(2) !== 'Z') {
      currNode =
        steps[step % steps.length] === 'L'
          ? map[currNode].left
          : map[currNode].right
      step++
    }
    return step
  })

  const totalStepsNeeded = stepsNeeded.reduce(lowestCommonDivisor)

  console.log('Part 2:', totalStepsNeeded)
}

part1()
part2()
