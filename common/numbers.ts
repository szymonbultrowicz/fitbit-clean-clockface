export const formatNumber = (value: number | undefined) => {
    if (value === undefined) {
        return '';
    }

    return value.toLocaleString(undefined, {
        useGrouping: true,
    });
};