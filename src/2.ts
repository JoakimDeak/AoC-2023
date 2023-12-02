const input = await Bun.file("inputs/2.txt").text();

type Game = {
  id: number;
  sets: { red: number; green: number; blue: number }[];
};
type Set = Game["sets"][number];
type Color = keyof Set;

const games = input.split("\n").reduce((games, game) => {
  const [gameId, rawSets] = game.split(": ");
  const [_, id] = gameId.split(" ");

  const sets = rawSets.split("; ").reduce((sets, rawSet) => {
    sets.push(
      rawSet.split(", ").reduce(
        (parts, part) => {
          const [amount, color] = part.split(" ") as [number, Color];
          parts[color] = Number(amount);

          return parts;
        },
        {
          red: 0,
          green: 0,
          blue: 0,
        }
      )
    );

    return sets;
  }, [] as Game["sets"]);

  games.push({ id: Number(id), sets });

  return games;
}, [] as Game[]);

const part1 = () => {
  const limits = {
    red: 12,
    green: 13,
    blue: 14,
  } as const;

  const idSum = games.reduce((sum, { id, sets }) => {
    if (
      sets.every(
        ({ red, green, blue }) =>
          red <= limits.red && green <= limits.green && blue <= limits.blue
      )
    ) {
      return sum + id;
    }
    return sum;
  }, 0);

  console.log("Part 1:", idSum);
};

const part2 = () => {
  const sum = games.reduce((sum, { sets }) => {
    const { red, green, blue } = sets.reduce(
      (max, { red, green, blue }) => {
        red > max.red && (max.red = red);
        green > max.green && (max.green = green);
        blue > max.blue && (max.blue = blue);

        return max;
      },
      {
        red: -Infinity,
        green: -Infinity,
        blue: -Infinity,
      } satisfies Set
    );

    return sum + red * green * blue;
  }, 0);

  console.log("Part 2:", sum);
};

part1();
part2();
