import request from "supertest";
import app from "../SPTrees/server.js"; 
import prisma from "../SPTrees/prisma.js";

describe("API de Árvores", () => {

  beforeEach(async () => {
    await prisma.tree.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("deve criar uma nova árvore (POST /trees)", async () => {
    const novaArvore = {
      numero: 1,
      vernaculo: "Ipê-amarelo",
      cientify_name: "Handroanthus albus",
      height: 10.5,
      dap: 50,
      phytosanitary_state: "Ótimo",
      structure_state: "Estável",
      suggested_management: "Poda",
      coords: { utm: "23S 330000 7400000" },
    };

    const response = await request(app).post("/trees").send(novaArvore);

    expect(response.status).toBe(200);
    expect(response.body.tree).toHaveProperty("id");
    expect(response.body.tree.vernaculo).toBe("Ipê-amarelo");
  });

  it("deve listar árvores (GET /trees)", async () => {
    await prisma.tree.create({
      data: {
        numero: 2,
        vernaculo: "Jacarandá",
        cientify_name: "Jacaranda mimosifolia",
        height: 15,
        dap: 60,
        phytosanitary_state: "Bom",
        structure_state: "Estável",
        suggested_management: "Monitoramento",
        coords: { utm: "23S 331000 7410000" },
      },
    });

    const response = await request(app).get("/trees");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.trees)).toBe(true);
    expect(response.body.trees.length).toBeGreaterThan(0);
  });
});
