
const Room = require('../models/Room')


const salas = [];

const socketController = (socket, io) => {

    socket.on('update-diagram', (data) => {

        socket.to(data.sala).emit('actualizar-diagrama', data.xml)
        const roomID = data.sala;
        const newData = {
            diagram: data.xml
        }
        // Buscar y actualizar la sala con el ID proporcionado
        Room.updateOne({ _id: roomID }, newData)
            .exec()
            .then((result) => {
                // Verificar si se encontró y se actualizó la sala
                if (result.nModified === 0) {
                    // Si no se modificó ningún documento, significa que la sala no se encontró
                    console.log('Sala no encontrada');
                }

                // Enviar una respuesta de éxito
                console.log('Sala actualizada exitosamente');
            })
            .catch((error) => {
                console.error('Error al actualizar la sala:', error);
                
            });
    });

    socket.on('join', (data, callback) => {
        const { user, sala } = data;
        socket.join(sala);
        const salaEncontrada = salas.find((x) => x.sala === sala);
        if (salaEncontrada) {
            salaEncontrada.users.push({
                id: socket.id,
                user: user,
                anfitrion: false
            });
            const usuarioAnfitrion = salaEncontrada.users.find((x) => x.anfitrion === true);
            if (usuarioAnfitrion) {
                io.to(usuarioAnfitrion.id).emit('confirmar-participante', usuarioAnfitrion);
            }
        } else {
            const lasa = {
                sala: sala,
                users: [],
            }
            lasa.users.push({
                id: socket.id,
                user: user,
                anfitrion: true
            })

            salas.push(lasa);
        }

    })

    socket.on('new-user', (data) => {
        socket.emit('aceptar', 'participante');
    });

    socket.on('disconnect', () => {
        /* salas.forEach(sala => {
            const usuarioIndex = sala.users.findIndex(user => user.id === socket.id);
            if (usuarioIndex !== -1) {

                // Usuario encontrado en la sala, eliminarlo
                sala.users.splice(usuarioIndex, 1);                
                // Realiza otras acciones relacionadas con la desconexión, si es necesario
            }
        });     */
    });
}



module.exports = {
    socketController
}

