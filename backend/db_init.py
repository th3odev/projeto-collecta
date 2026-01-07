import bcrypt
from models import Usuario, Item, PapelUsuario, StatusItem, StatusUsuario


# =========================
# Utilitário de senha
# =========================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")


# =========================
# Seed principal
# =========================

def init_mock_data(Session):
    db = Session()

    try:
        # Evita seed duplicado
        if db.query(Usuario).first():
            print("Seed já existe, pulando...")
            return

        print("🌱 Inserindo usuários mock...")

        # =========================
        # Usuários
        # =========================

        admin = Usuario(
            nome_usuario="admin",
            senha_hash=hash_password("admin123"),
            email="admin@example.com",
            apelido="AdminMaster",
            papel=PapelUsuario.admin,
            status=StatusUsuario.ativo
        )

        user1 = Usuario(
            nome_usuario="maria",
            senha_hash=hash_password("maria123"),
            email="maria@example.com",
            apelido="MariaEco",
            status=StatusUsuario.ativo
        )

        user2 = Usuario(
            nome_usuario="joao",
            senha_hash=hash_password("joao123"),
            email="joao@example.com",
            apelido="JoaoRecicla",
            status=StatusUsuario.ativo
        )

        user3 = Usuario(
            nome_usuario="pedro",
            senha_hash=hash_password("pedro123"),
            email="pedro@example.com",
            apelido="PedroGreen",
            status=StatusUsuario.ativo
        )

        db.add_all([admin, user1, user2, user3])
        db.commit()

        # Refresh IDs
        for u in [admin, user1, user2, user3]:
            db.refresh(u)

        print("✅ Usuários criados")

        # =========================
        # Itens
        # =========================

        print("📦 Inserindo itens mock...")

        items = [
            Item(
                dono_id=user1.id,
                titulo="Garrafas PET",
                descricao="50 garrafas PET limpas",
                categoria="Plásticos",
                subcategoria="PET",
                condicao="Bom",
                instrucoes_coleta="Buscar na porta após 18h",
                cep="01001-000",
                endereco="Av. Paulista, 1000",
                referencia="Edifício azul",
                url_imagens=["pet.jpg"],
                status=StatusItem.disponivel
            ),
            Item(
                dono_id=user2.id,
                titulo="Sucata de ferro",
                descricao="Peças de ferro de geladeira velha",
                categoria="Metais",
                subcategoria="Ferro",
                condicao="Regular",
                instrucoes_coleta="Ligar antes",
                cep="02020-000",
                endereco="Rua das Flores, 200",
                referencia="Casa com portão verde",
                url_imagens=["ferro.jpg"],
                status=StatusItem.disponivel
            ),
            Item(
                dono_id=admin.id,
                titulo="Papelão acumulado",
                descricao="Caixas de papelão limpas",
                categoria="Papel",
                subcategoria="Papelão",
                condicao="Novo",
                instrucoes_coleta="Retirada qualquer horário",
                cep="03030-000",
                endereco="Rua Central, 50",
                referencia="Próximo ao mercado",
                url_imagens=["papelao.jpg"],
                status=StatusItem.disponivel
            )
        ]

        db.add_all(items)
        db.commit()

        print("✅ Itens criados")
        print("🎉 Seed finalizado com sucesso")

    except Exception as e:
        db.rollback()
        print("❌ Erro ao inserir mock data:", e)

    finally:
        db.close()
