export function shouldElementBeSelected(
    selectedDate: Date,
    begin: Date,
    end: Date
): boolean {
    const selectedDateDayMonthYear = new Date(
        selectedDate.getUTCFullYear(),
        selectedDate.getUTCMonth(),
        selectedDate.getUTCDate()
    );
    const beginDayMonthYear = new Date(
        begin.getUTCFullYear(),
        begin.getUTCMonth(),
        begin.getUTCDate()
    );
    const endDayMonthYear = new Date(
        end.getUTCFullYear(),
        end.getUTCMonth(),
        end.getUTCDate()
    );
    return (
        beginDayMonthYear.getTime() <= selectedDateDayMonthYear.getTime() &&
        selectedDateDayMonthYear.getTime() <= endDayMonthYear.getTime()
    );
}

export function convertDateToInputFormat(date: Date): string {
    const dateLocale = date
        .toLocaleString("pt-BR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        })
        .split("/")
        .reverse()
        .join("-");
    const timeLocale = date.toLocaleString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    });
    return `${dateLocale}T${timeLocale}`;
}
