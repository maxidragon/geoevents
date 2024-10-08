import { TextField } from "@mui/material";
import { ChangeEvent, useState } from "react";

import {
    attemptResultToInput,
    autocompleteTimeAttemptResult,
    inputToAttemptResult,
    isValid,
    reformatInput,
} from "@/logic/timeFormatters";

interface TimeInputProps {
    value: number;
    onChange: (value: number) => void;
    disabled: boolean;
    placeholder?: string;
}

const TimeInput = ({
    value,
    onChange,
    disabled,
    placeholder,
}: TimeInputProps) => {
    const [prevValue, setPrevValue] = useState<number>(value);
    const [draftInput, setDraftInput] = useState<string>(
        attemptResultToInput(value)
    );

    if (prevValue !== value) {
        setDraftInput(attemptResultToInput(value));
        setPrevValue(value);
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDraftInput(reformatInput(event.target.value));
    };

    const handleBlur = () => {
        const attempt = isValid(draftInput)
            ? autocompleteTimeAttemptResult(inputToAttemptResult(draftInput))
            : 0;
        onChange(attempt);
        setDraftInput(attemptResultToInput(value));
    };

    return (
        <TextField
            value={draftInput}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder || "Time"}
            disabled={disabled}
        />
    );
};

export default TimeInput;
