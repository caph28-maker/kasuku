// script.js - Kasuku con Google Apps Script (versión final)
https://script.google.com/macros/s/AKfycbzZ0ZlEiJ0BcWnxu0wCe7fYtJHy3nYKr6EuAjg2LR3tNDpr5D2b1J6QkJAGv2wpWPyWUw/exec

async function cargarTareas() {
    const contenedor = document.getElementById("tasks-list");
    if (!contenedor) return;

    contenedor.innerHTML = '<div class="loading">📋 Cargando tareas desde Kasuku...</div>';

    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) {
            throw new Error(`HTTP ${respuesta.status}`);
        }
        const tareas = await respuesta.json();
        
        if (tareas.length === 0) {
            contenedor.innerHTML = '<div class="error-message">✨ No hay tareas con estado "abierta" en este momento. Modificá el estado en tu hoja de cálculo para que aparezcan.</div>';
            return;
        }
        
        let tareasHTML = "";
        for (const tarea of tareas) {
            let precioFormateado = "";
            if (!isNaN(parseFloat(tarea.precio))) {
                precioFormateado = `${tarea.moneda} ${parseFloat(tarea.precio).toLocaleString()}`;
            } else {
                precioFormateado = `${tarea.moneda} ${tarea.precio}`;
            }
            
            tareasHTML += `
                <div class="task-card">
                    <div class="task-title">${escapeHtml(tarea.nombre)}</div>
                    <div class="task-description">${escapeHtml(tarea.descripcion)}</div>
                    <div class="task-tools">🔧 ${escapeHtml(tarea.herramientas)}</div>
                    <div class="task-price">💰 ${precioFormateado}</div>
                    <a href="mailto:${escapeHtml(tarea.contacto)}?subject=Me%20interesa%20la%20tarea%3A%20${encodeURIComponent(tarea.nombre)}" 
                       class="contact-btn">
                        ✉️ Quiero hacer esta tarea
                    </a>
                </div>
            `;
        }
        contenedor.innerHTML = tareasHTML;
        
    } catch (error) {
        console.error("Error detallado:", error);
        contenedor.innerHTML = `
            <div class="error-message">
                ⚠️ No se pudieron cargar las tareas.<br>
                <small>Verificá que la URL del Apps Script sea correcta y que la hoja de cálculo esté accesible.</small>
            </div>
        `;
    }
}

function escapeHtml(texto) {
    if (!texto) return "";
    return texto
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

window.addEventListener("DOMContentLoaded", cargarTareas);
