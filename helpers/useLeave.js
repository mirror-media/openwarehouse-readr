import { useState, useEffect } from 'react';


function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

async function execGQL(payload) {
    const data = await fetch('/admin/api', {
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

async function leavePage() {
    console.log('leavePage');
    const href = window.location.href;
    const parts = href.split('/');
    const list = capitalize(parts[parts.length - 2].slice(0, -1));
    const id = parts[parts.length - 1];

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

    return {
        list,
        id
    };
}

export function useLeave() {
    const [leavePageInfo, setLeavePageInfo] = useState(leavePage());

    useEffect(() => {
        function handleUnload() {
            console.log('blur');
            setLeavePageInfo(leavePage());
            // const href = window.location.href;
            // const parts = href.split('/');
            // const list = capitalize(parts[parts.length - 2].slice(0, -1));
            // const id = parts[parts.length - 1];

            // const editingTime = Date.parse(localStorage.getItem(`${list.toLowerCase()}/${id}`));
            // console.log(editingTime);
            // if (editingTime) {
            //     const UPDATE_POST = `
            //     mutation {
            //         updatePost(id: ${id}, data: { lockTime: null }) {
            //         id
            //         }
            //     }`;
            //     await execGQL(UPDATE_POST);
            //     localStorage.removeItem(`${list.toLowerCase()}/${id}`);
            // }
        }
        //beforeunload


        window.addEventListener('blur', handleUnload);

        return () => window.removeEventListener('blur', handleUnload);
    }, []);

    return leavePageInfo;
}