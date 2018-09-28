const todo = document.getElementById('todo');
const doing = document.getElementById('doing');
const done = document.getElementById('done');
const btnSend = document.getElementById('btnSend');
const inputData = document.getElementById('input');

let idx = 0;
let data = [];

function sendData() {
    let endSpace;
    let title;
    let action;
    let index;

    const val = inputData.value;
    const firstSpace = val.indexOf(' ');
    const command = val.substring(0, firstSpace);

    if (command === 'create') {
        title = val.substring(firstSpace+1);
        title = title.substr(1, title.length-2);
        data.push({ id: idx+1, type: 'todo', deleted: false, title });
        idx++;
    } else if (command === 'move') {
        endSpace = val.lastIndexOf(' ');
        index = val.substring(firstSpace+1, endSpace);
        action = val.substring(endSpace+1);
        data[index-1].type = action;
    } else if (command === 'remove') {
        index = val.substring(firstSpace+1);
        data[index-1].deleted = true;
    } else {
        alert("Command not found!");
    }
    render();
}

function render() {
    const showTodo = data.filter(q => q.type === 'todo' && !q.deleted);
    const showDoing = data.filter(q => q.type === 'doing' && !q.deleted);
    const showDone = data.filter(q => q.type === 'done' && !q.deleted);

    todo.innerHTML = showTodo.map(q => `${q.id}. ${q.title}`).join('<br>');
    doing.innerHTML = showDoing.map(q => `${q.id}. ${q.title}`).join('<br>');
    done.innerHTML = showDone.map(q => `${q.id}. ${q.title}`).join('<br>');
}