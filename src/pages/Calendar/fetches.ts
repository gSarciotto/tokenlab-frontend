export interface CreateEventResult {
    status: boolean;
    message: string;
}

export interface CreateEventParams {
    token: string;
    begin: Date;
    end: Date;
    description: string;
}

export async function createEvent({
    token,
    begin,
    end,
    description
}: CreateEventParams): Promise<CreateEventResult> {
    let result: CreateEventResult;
    const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ begin, end, description })
    });
    if (response.status === 201) {
        result = { status: true, message: "Evento criado com sucesso" };
    } else if (response.status === 401 || response.status === 404) {
        result = {
            status: false,
            message:
                "Falha na autenticação. Redirecionando para a tela de login..."
        };
    } else if (response.status === 409) {
        result = {
            status: false,
            message: "Evento em conflito com outro evento já existente."
        };
    } else if (response.status === 400) {
        const responseJson = await response.json();
        console.log("Error at event create (validation): ", responseJson);
        result = { status: false, message: "Dados do evento são inválidos." };
    } else {
        result = { status: false, message: "Erro desconhecido." };
    }
    return Promise.resolve(result);
}

export interface Event {
    id: string;
    username: string;
    description: string;
    begin: Date;
    end: Date;
}

interface EventFromResponse {
    id: string;
    creatorUsername: string;
    begin: string;
    end: string;
    description: string;
}

function convertEventFromResponseToEvent(input: EventFromResponse): Event {
    return {
        id: input.id,
        username: input.creatorUsername,
        begin: new Date(input.begin),
        end: new Date(input.end),
        description: input.description
    };
}

interface GetEventsResult {
    status: boolean;
    message?: string;
    events?: Event[];
}

export async function getEvents(token: string): Promise<GetEventsResult> {
    const response = await fetch("http://localhost:3000/events", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (response.status === 200) {
        const responseBody = await response.json();
        if (responseBody.events !== undefined) {
            const convertedEvents = (responseBody.events as EventFromResponse[]).map(
                convertEventFromResponseToEvent
            );
            return Promise.resolve({
                status: true,
                events: convertedEvents
            });
        } else {
            console.log("Events not found in response body");
            return Promise.resolve({
                status: false,
                message: "Erro inesperado ao buscar eventos."
            });
        }
    } else if (response.status === 401 || response.status === 404) {
        return Promise.resolve({
            status: false,
            message:
                "Falha na autenticação. Redirecionando para a tela de login..."
        });
    } else {
        const responseBody = await response.json();
        console.log(responseBody);
        return Promise.resolve({
            status: false,
            message: "Erro desconhecido ao buscar eventos."
        });
    }
}

interface DeleteEventParams {
    token: string;
    eventId: string;
}

type DeleteEventResult = CreateEventResult;

export async function deleteEventFetch({
    token,
    eventId
}: DeleteEventParams): Promise<DeleteEventResult> {
    const response = await fetch("http://localhost:3000/events", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ eventId })
    });
    if (response.status === 200) {
        return Promise.resolve({
            status: true,
            message: "Evento deletado com sucesso."
        });
    } else if (response.status === 401) {
        return Promise.resolve({
            status: false,
            message:
                "Falha na autenticação. Redirecionando para a tela de login..."
        });
    } else if (response.status === 404) {
        console.log("Erro 404 delete ", token, eventId);
        return Promise.resolve({
            status: false,
            message:
                "Evento não encontrado ou você não possue permissão para deletar esse evento."
        });
    } else {
        const responseJson = await response.json();
        console.log("Erro 500 delete", responseJson);
        return Promise.resolve({
            status: false,
            message: "Erro desconhecido ao deletar um evento."
        });
    }
}

type UpdateEventParams = CreateEventParams & { id: string };
type UpdateEventResult = CreateEventResult;

export async function updateEventFetch({
    token,
    id,
    begin,
    end,
    description
}: UpdateEventParams): Promise<UpdateEventResult> {
    const response = await fetch("http://localhost:3000/events", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ begin, end, description, id })
    });
    if (response.status === 201) {
        return Promise.resolve({
            status: true,
            message: "Evento atualizado com sucesso!"
        });
    } else if (response.status === 400) {
        return Promise.resolve({
            status: false,
            message:
                "Falha na autenticação. Redirecionando para a tela de login..."
        });
    } else if (response.status === 404) {
        return Promise.resolve({
            status: false,
            message:
                "Evento não encontrado ou você não possue permissão para deletar esse evento."
        });
    } else {
        console.log("Erro desconhecido update event: ", response.body);
        return Promise.resolve({
            status: false,
            message: "Erro desconhecido ao atualizar um evento."
        });
    }
}
