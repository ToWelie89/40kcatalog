let html = '';
let subfolderId = 0;

const isImage = name => {
    name = name.toLowerCase();
    return name.endsWith('.png') ||
        name.endsWith('.jpg') ||
        name.endsWith('.jpeg') ||
        name.endsWith('.webp') ||
        name.endsWith('.bmp') ||
        name.endsWith('.gif');
}

const isFile = name => {
    name = name.toLowerCase();
    return name.endsWith('.stl') || name.endsWith('.obj') || name.endsWith('.3mf') || name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.bmp') || name.endsWith('.gif') || name.endsWith('.jpeg');
}

const renderDir = async (dir, level = 0, isStart = false) => {
    let children;
    if (dir.children) {
        children = dir.children;
    } else {
        children = dir;
    }

    if (children) {
        html +=
        `
            <div class="folder ${isStart ? '' : 'collapsed'}" id="${subfolderId}">
        `;
        children.forEach(child => {
            let isFolder = !isFile(child.name);
            if (!isFolder) {
                html +=
                `
                    <div class="el ${isImage(child.name) ? 'image' : ''}" path="${child.path}" level="${level}">
                        <span>${child.name}</span>
                    </div>
                `;
            } else { // is folder
                html +=
                `
                    <div class="el" level="${level}">
                        ${child.name} <button for="${subfolderId}">+</button>
                    </div>
                `;
            }

            if (isFolder && child.children) { // is folder
                subfolderId++;
                renderDir(child.children, (level + 1), false);
            }
        })
        html +=
        `
            </div>
        `;
    }
}

const run = async () => {
    let res = await fetch('./files.json');
    let json = await res.json();

    console.log('json', json)

    renderDir(json, 0, true);

    document.getElementById('catalog').innerHTML = html;

    document.querySelectorAll('.el button').forEach(button => {
        button.addEventListener('click', () => {
            const id = Number(button.getAttribute('for')) + 1;

            if (document.querySelector(`.folder[id="${id}"]`).classList.contains('collapsed')) {
                document.querySelector(`.folder[id="${id}"]`).classList.remove('collapsed');
                button.innerText = '-';
            } else {
                document.querySelector(`.folder[id="${id}"]`).classList.add('collapsed');
                button.innerText = '+';
            }
        })
    });
    document.querySelectorAll('.el.image span').forEach(imgLink => {
        imgLink.addEventListener('mouseenter', ev => {
            const element = ev.target;
            const bbox = element.getBoundingClientRect();

            const parent = element.parentElement;
            let imgPath = parent.getAttribute('path');
            console.log('imgPath', imgPath)
            imgPath = imgPath.replace('D:\\Downloads\\3D prints\\MEGA FOLDER\\Printed40k\\', './pics/');

            document.querySelector('#imagePreview').style.top = Math.floor(bbox.top) + 'px';
            document.querySelector('#imagePreview').style.left = Math.floor(bbox.left + 30) + 'px';
            document.querySelector('#imagePreview img').setAttribute('src', imgPath);
            document.querySelector('#imagePreview').style.display = 'block';
        });
        imgLink.addEventListener('mouseleave', ev => {
            document.querySelector('#imagePreview').style.display = 'none';
            document.querySelector('#imagePreview img').setAttribute('src', '');
        });
    });
    document.getElementById('collapseAll').addEventListener('click', () => {
        document.querySelectorAll('.folder:not([id="0"])').forEach(folder => {
            folder.classList.add('collapsed');
        });
    });
    document.getElementById('expandAll').addEventListener('click', () => {
        document.querySelectorAll('.folder').forEach(folder => {
            folder.classList.remove('collapsed');
        });
    });
}

run();