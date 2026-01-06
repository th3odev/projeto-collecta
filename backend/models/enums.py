import enum

class StatusUsuario(str, enum.Enum):
    ativo = "ativo"
    banido = "banido"

class PapelUsuario(str, enum.Enum):
    admin = "admin"
    usuario = "usuario"

class StatusItem(str, enum.Enum):
    disponivel = "disponivel"
    coletado = "coletado"
    nao_encontrado = "nao_encontrado"
    removido = "removido"

class TipoRelato(str, enum.Enum):
    nao_encontrado = "nao_encontrado"
    inapropriado = "inapropriado"
    mensages_ofensivas = "mensages_ofensivas"
    spam = "spam"
    outro = "outro"

class StatusRelato(str, enum.Enum):
    aberto = "aberto"
    resolvido = "resolvido"
    descartado = "descartado"

class MotivoTransacao(str, enum.Enum):
    coleta_item = "coleta_item"
    item_coletado = "item_coletado"
    adicao_admin = "adicao_admin"
    remocao_admin = "remocao_admin"
    resgate_recompensa = "resgate_recompensa"
    penalidade = "penalidade"

class StatusResgate(str, enum.Enum):
    pendente = "pendente"
    aprovado = "aprovado"
    entregue = "entregue"