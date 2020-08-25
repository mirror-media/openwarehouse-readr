const lockPeriod = 900000;

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function redirectToListPage() {
    const href = window.location.href;
    const lastIndexOfSlash = href.lastIndexOf('/');
    location.href = href.substring(0, lastIndexOfSlash);
}

function isEditable(users) {
    return users.reduce((result, user) => {
        return result || (user['role'] == 'admin' || user['role'] == 'moderator')
    }, false);
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

export async function lockPage() {
    const href = window.location.href;
    const parts = href.split('/');
    const list = capitalize(parts[parts.length - 2].slice(0, -1));
    const id = parts[parts.length - 1];

    const GET_ALL_USERS = `
    query {
        allUsers {
            role
        }
    }`;

    const GET_POST = `
    query {
        Post(where: { id: ${id} }) {
            lockTime
        }
    }`;

    const roles = await execGQL(GET_ALL_USERS);
    const post = await execGQL(GET_POST);

    let lockTime;
    if (post && post['data']['Post']['lockTime']) {
        lockTime = Date.parse(post['data']['Post']['lockTime']);
    }

    if (!lockTime || new Date() - lockTime >= lockPeriod) {
        const current = new Date().toISOString();
        const UPDATE_POST = `
        mutation {
            updatePost(id: ${id}, data: { lockTime: "${current}" }) {
              id
            }
        }`;
        await execGQL(UPDATE_POST);
        localStorage.setItem(`${list.toLowerCase()}/${id}`, current);
    } else {
        if (roles && !isEditable(roles['data']['allUsers'])) {
            const editingTime = Date.parse(localStorage.getItem(`${list.toLowerCase()}/${id}`));
            if (!editingTime || new Date() - editingTime >= lockPeriod) {
                const lastSeconds = (lockPeriod - (new Date() - lockTime)) / 1000;
                alert(`有人正在編輯此文件，請稍候一段時間。\n解鎖剩餘時間：${Math.floor(lastSeconds / 60)} 分 ${Math.floor(lastSeconds % 60)} 秒`);
                redirectToListPage();
            }
        }
    }

    return {
        list,
        id
    };
}