const {PrismaClient} = require('@prisma/client')
const database = new PrismaClient();

async function main() {
    try {
        await database.category.createMany({
            data: [
                {name: "Ciência da computação"},
                {name: "Música"},
                {name: "Gastronomia"},
                {name: "Arte"},
                {name: "Cinema"},
                {name: "Futebol"},
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
