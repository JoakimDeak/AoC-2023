const input = await Bun.file("inputs/1.txt").text();

const part1 = () => {
  const sum = input.split("\n").reduce((sum, line) => {
    const numbers: string[] = [];
    for (let i = 0; i < line.length; i++) {
      if (["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(line[i])) {
        numbers.push(line[i]);
      }
    }

    return sum + Number(numbers.at(0)! + numbers.at(-1)!);
  }, 0);

  console.log("part 1:", sum);
};

const part2 = () => {
  const numberValues = new Map([
    ["1", "1"],
    ["2", "2"],
    ["3", "3"],
    ["4", "4"],
    ["5", "5"],
    ["6", "6"],
    ["7", "7"],
    ["8", "8"],
    ["9", "9"],
    ["one", "1"],
    ["two", "2"],
    ["three", "3"],
    ["four", "4"],
    ["five", "5"],
    ["six", "6"],
    ["seven", "7"],
    ["eight", "8"],
    ["nine", "9"],
  ] as const);
  const validNumbers = Array.from(numberValues.keys());
  type ValidNumber = (typeof validNumbers)[number];

  const sum = input.split("\n").reduce((sum, line) => {
    const { min, max } = validNumbers.reduce(
      (prev, number) => {
        const next = { ...prev };

        [line.indexOf(number), line.lastIndexOf(number)].forEach((index) => {
          if (index < 0) {
            return;
          }
          if (index > next.max.index) {
            next.max = { number: number, index };
          }
          if (index < next.min.index) {
            next.min = { number: number, index };
          }
        });

        return next;
      },
      {
        min: { number: "1", index: Infinity },
        max: { number: "1", index: -Infinity },
      } as Record<"min" | "max", { number: ValidNumber; index: number }>
    );

    return (
      sum +
      Number(numberValues.get(min.number)! + numberValues.get(max.number)!)
    );
  }, 0);

  console.log("part 2:", sum);
};

part1();
part2();
