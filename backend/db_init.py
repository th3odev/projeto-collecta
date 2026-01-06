from models import Usuario, Item, PapelUsuario, StatusItem
from passlib.hash import bcrypt
from repositories.auth import registrar_usuario
from models import Relato, MensagemRelato, TipoRelato, StatusRelato, StatusUsuario
from repositories.relatos import criar_relato, adicionar_mensagem

def init_mock_data(Session):
    db = Session()
    try:
        if db.query(Usuario).first():
            return

        # Admin
        admin = Usuario(
            nome_usuario="admin",
            senha_hash=bcrypt.hash("admin123"),
            email="admin@example.com",
            apelido="AdminMaster",
            papel=PapelUsuario.admin,
            status=StatusUsuario.ativo
        )
        db.add(admin)

        # Users
        user1 = Usuario(
            nome_usuario="maria",
            senha_hash=bcrypt.hash("maria123"),
            email="maria@example.com",
            apelido="MariaEco",
            status=StatusUsuario.ativo
        )
        db.add(user1)

        user2 = Usuario(
            nome_usuario="joao",
            senha_hash=bcrypt.hash("joao123"),
            email="joao@example.com",
            apelido="JoaoRecicla",
            status=StatusUsuario.ativo
        )
        db.add(user2)

        user3 = Usuario(
            nome_usuario="pedro",
            senha_hash=bcrypt.hash("pedro123"),
            email="pedro@example.com",
            apelido="PedroGreen",
            status=StatusUsuario.ativo
        )
        db.add(user3)

        db.commit()
        db.refresh(admin)
        db.refresh(user1)
        db.refresh(user2)
        db.refresh(user3)

        # Items
        item1 = Item(
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
        )
        db.add(item1)

        item2 = Item(
            dono_id=user2.id,
            titulo="Sucata de ferro",
            descricao="Peças de ferro de geladeira velha",
            categoria="Metais",
            subcategoria="Ferro",
            condicao="Regular",
            instrucoes_coleta="Ligar antes: (11) 99999-9999",
            cep="02020-000",
            endereco="Rua das Flores, 200",
            referencia="Casa com portão verde",
            url_imagens=["ferro-sucata.jpg"],
            status=StatusItem.disponivel
        )
        db.add(item2)

        item3 = Item(
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
        db.add(item3)

        db.commit()
        print("Mock data inserted: 1 admin, 3 users, 3 items")

        init_mock_relatos(Session, admin, user1, user2, user3, item1, item2)

    except Exception as e:
        db.rollback()
        print("Error inserting mock data:", e)
    finally:
        db.close()





def init_mock_relatos(Session, admin, user1, user2, user3, item1, item2):
    db = Session()

    try:
        # Relato 1: Não encontrado (sobre item)
        relato1 = criar_relato(
            db=db,
            tipo=TipoRelato.nao_encontrado,
            descricao="O item anunciado não estava no local combinado.",
            url_imagens=["relato1_img1.jpg"],
            relator=user2,
            item=item1,
            relatado=user1
        )

        adicionar_mensagem(
            db=db,
            relato_id=relato1.id,
            autor=user2,
            texto="Cheguei no endereço e não tinha nada na porta.",
            url_imagens=[]
        )

        adicionar_mensagem(
            db=db,
            relato_id=relato1.id,
            autor=user1,
            texto="Desculpa, esqueci de deixar. Pode vir amanhã?",
            url_imagens=[]
        )

        adicionar_mensagem(
            db=db,
            relato_id=relato1.id,
            autor=admin,
            texto="Aguardando resolução entre as partes.",
            url_imagens=[]
        )

        # Relato 2: Inapropriado (sobre usuário)
        relato2 = criar_relato(
            db=db,
            tipo=TipoRelato.inapropriado,
            descricao="Usuário enviou mensagens ofensivas no chat.",
            url_imagens=["relato2_img1.jpg"],
            relator=user3,
            item=None,
            relatado=user2
        )

        adicionar_mensagem(
            db=db,
            relato_id=relato2.id,
            autor=user3,
            texto="Ele me chamou de nomes feios.",
            url_imagens=[]
        )

        adicionar_mensagem(
            db=db,
            relato_id=relato2.id,
            autor=user2,
            texto="Foi só uma brincadeira, relaxa.",
            url_imagens=[]
        )

        print("Mock relatos and messages inserted")
    except Exception as e:
        db.rollback()
        print("Error inserting mock relatos:", e)
    finally:
        db.close()