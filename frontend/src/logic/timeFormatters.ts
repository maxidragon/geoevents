export const timeToString = (result: number) => {
    return centisecondsToClockFormat(result).toString();
};

export const centisecondsToClockFormat = (centiseconds: number) => {
    if (!Number.isFinite(centiseconds)) {
        throw new Error(
            `Invalid centiseconds, expected positive number, got ${centiseconds}.`
        );
    }
    return new Date(centiseconds * 10)
        .toISOString()
        .substr(11, 11)
        .replace(/^[0:]*(?!\.)/g, "");
};

export const toInt = (string: string) => {
    const number = parseInt(string, 10);
    if (Number.isNaN(number)) return null;
    return number;
};

export const reformatInput = (input: string) => {
    const number = toInt(input.replace(/\D/g, "")) || 0;
    if (number === 0) return "";
    const str = "00000000" + number.toString().slice(0, 8);
    //eslint-disable-next-line
    //@ts-ignore
    const [, hh, mm, ss, cc] = str.match(/(\d\d)(\d\d)(\d\d)(\d\d)$/);
    return `${hh}:${mm}:${ss}.${cc}`.replace(/^[0:]*(?!\.)/g, "");
};

export const inputToAttemptResult = (input: string) => {
    if (input === "") return 0;
    const num = toInt(input.replace(/\D/g, "")) || 0;
    return (
        Math.floor(num / 1000000) * 360000 +
        Math.floor((num % 1000000) / 10000) * 6000 +
        Math.floor((num % 10000) / 100) * 100 +
        (num % 100)
    );
};

export const attemptResultToInput = (attemptResult: number) => {
    if (attemptResult === 0) return "";
    return centisecondsToClockFormat(attemptResult);
};

export const isValid = (input: string) => {
    return input === attemptResultToInput(inputToAttemptResult(input));
};

export const autocompleteTimeAttemptResult = (attemptResult: number) => {
    if (attemptResult <= 0) return attemptResult;
    if (attemptResult <= 10 * 6000) return attemptResult;
    return Math.round(attemptResult / 100) * 100;
};
