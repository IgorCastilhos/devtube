const {PrismaClient} = require('@prisma/client')
const database = new PrismaClient();

async function main() {
    try {
        await database.category.createMany({
            data: [
                {name: "Estrutura de Dados"},
                {name: "Algoritmos"},
                {name: "HTML"},
                {name: "CSS"},
                {name: "JavaScript"},
                {name: "React"},
                {name: "PostgreSQL"},
                {name: "Go"},
                {name: "MySQL"},
                {name: "Docker"},
                {name: "Postman"},
            ]
        });

        console.log("Sucesso")
    } catch (error) {
        console.log("Erro ao fazer o seed das categorias do banco de dados", error)
    } finally {
        await database.$disconnect()
    }
}

main()
