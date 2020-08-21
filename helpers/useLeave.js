import { useState, useEffect } from 'react';


function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function execGQL(payload) {
    const data = fetch('/admin/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: payload,
        }),
    }).then(result => result.json());
    return data;
}

function leavePage() {
    const href = window.location.href;
    const parts = href.split('/');
    const list = capitalize(parts[parts.length - 2].slice(0, -1));
    const id = parts[parts.length - 1];

    return {
        list,
        id
    };
}

export function useLeave() {
    const [leavePageInfo, setLeavePageInfo] = useState(leavePage());

    useEffect(() => {
        async function handleUnload() {
            const { list, id } = leavePageInfo;

            const editingTime = Date.parse(localStorage.getItem(`${list.toLowerCase()}/${id}`));
            if (editingTime) {
                const UPDATE_POST = `
                mutation {
                    updatePost(id: ${id}, data: { lockTime: null }) {
                    id
                    }
                }`;
                await execGQL(UPDATE_POST);
                localStorage.removeItem(`${list.toLowerCase()}/${id}`);
            }
        }

        var pushState = history.pushState;
        history.pushState = function () {
            pushState.apply(history, arguments);
            handleUnload();
        };

        return () => history.pushState = pushState;
    }, []);

    return leavePageInfo;
}