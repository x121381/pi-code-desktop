function areJsonEquivalent(left, right) {
    return JSON.stringify(left) === JSON.stringify(right);
}
export function areConfigOptionsEquivalent(left, right) {
    if (left === right) {
        return true;
    }
    if (!left || !right || left.length !== right.length) {
        return false;
    }
    return left.every((option, index) => {
        const rightOption = right[index];
        return Boolean(rightOption) && areJsonEquivalent(option, rightOption);
    });
}
//# sourceMappingURL=configOptionsEquality.js.map