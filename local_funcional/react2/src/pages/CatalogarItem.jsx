import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { criarItem } from '/jsApiLayer/item.js'
import { uploadImages } from '/jsApiLayer/images.js'

function CatalogarItem() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria: 'Metais',
    subcategoria: 'Ferro',
    localizacao: '',
    cep: '',
    referencia: '',
    condicao: 'Bom',
    comoRetirar: '',
    diasDisponiveis: [],
    horarioInicio: '',
    horarioFim: '',
    observacoesRetirada: '',
    fotos: [],        // arquivos File para upload
    fotosPreview: []  // base64 para preview
  })
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const fileInputRef = useRef(null)

  const categorias = {
    'Metais': ['Ferro', 'Alumínio', 'Cobre', 'Inox', 'Outros'],
    'Plásticos': ['PET', 'PVC', 'PP', 'PS', 'PEAD', 'Outros'],
    'Papel/Papelão': ['Caixas', 'Branco', 'Jornais e Revistas', 'Revestido'],
    'Eletrônicos': ['Geladeira', 'Máquina Lavar', 'Microondas', 'TV', 'Eletroportátil', 'Celulares', 'Computadores', 'Impressoras'],
    'Vidros': ['Vidros'],
    'Resíduos de Construção': ['Tijolos', 'Telhas', 'Cimento e Argamassa', 'Areia e Pedra', 'Azulejo e Cerâmica'],
    'Madeiras': ['Bruta', 'Processada'],
    'Resíduos Especiais': ['Pneus', 'Óleo', 'Óleo de Cozinha', 'Pilhas', 'Baterias', 'Lâmpadas Fluorescentes', 'Roupas', 'Tecidos e Retalhos']
  }

  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

  const toggleDia = (dia) => {
    setFormData(prev => ({
      ...prev,
      diasDisponiveis: prev.diasDisponiveis.includes(dia)
        ? prev.diasDisponiveis.filter(d => d !== dia)
        : [...prev.diasDisponiveis, dia]
    }))
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    const fotosRestantes = 6 - formData.fotos.length
    
    if (files.length > fotosRestantes) {
      alert(`Você pode adicionar no máximo ${fotosRestantes} foto(s) a mais. Limite: 6 fotos`)
      return
    }

    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          fotos: [...prev.fotos, file],
          fotosPreview: [...prev.fotosPreview, reader.result]
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const startCamera = async () => {
    if (formData.fotos.length >= 6) {
      alert('Limite de 6 fotos atingido!')
      return
    }
    
    try {
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      }
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setShowCamera(true)
      }
    } catch (err) {
      console.error('Erro ao acessar câmera:', err)
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          streamRef.current = stream
          setShowCamera(true)
        }
      } catch (fallbackErr) {
        alert('Não foi possível acessar a câmera. Use "Escolher Arquivo" para fazer upload de uma foto.')
      }
    }
  }

  const capturePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    
    if (video && canvas) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)
      
      // Converter canvas para blob/file
      canvas.toBlob((blob) => {
        const file = new File([blob], `foto_${Date.now()}.jpg`, { type: 'image/jpeg' })
        const photoData = canvas.toDataURL('image/jpeg')
        
        setFormData(prev => ({
          ...prev,
          fotos: [...prev.fotos, file],
          fotosPreview: [...prev.fotosPreview, photoData]
        }))
      }, 'image/jpeg', 0.9)
      
      stopCamera()
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
  }

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index),
      fotosPreview: prev.fotosPreview.filter((_, i) => i !== index)
    }))
  }

  const buscarCEP = async () => {
    const cep = formData.cep.replace(/\D/g, '')
    if (cep.length !== 8) {
      alert('CEP inválido!')
      return
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()
      
      if (data.erro) {
        alert('CEP não encontrado!')
        return
      }

      setFormData(prev => ({
        ...prev,
        localizacao: `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`
      }))
    } catch (error) {
      alert('Erro ao buscar CEP')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.fotos.length === 0) {
      alert('Por favor, adicione pelo menos uma foto do item!')
      return
    }

    setIsLoading(true)

    try {
      // 1. Fazer upload das imagens primeiro
      const url_imagens = await uploadImages(formData.fotos)

      // 2. Criar texto de instruções completo
      let instrucoes = ''
      
      if (formData.comoRetirar) {
        instrucoes += `📦 COMO RETIRAR:\n${formData.comoRetirar}\n\n`
      }
      
      if (formData.diasDisponiveis.length > 0) {
        instrucoes += `📅 DIAS DISPONÍVEIS:\n${formData.diasDisponiveis.join(', ')}\n\n`
      }
      
      if (formData.horarioInicio && formData.horarioFim) {
        instrucoes += `⏰ HORÁRIO:\nDas ${formData.horarioInicio} às ${formData.horarioFim}\n\n`
      }
      
      if (formData.observacoesRetirada) {
        instrucoes += `ℹ️ OBSERVAÇÕES:\n${formData.observacoesRetirada}`
      }

      // 3. Criar o item via API
      const result = await criarItem(
        formData.titulo,
        formData.descricao,
        formData.categoria,
        formData.subcategoria,
        formData.condicao,
        formData.localizacao,
        formData.cep,
        formData.referencia,
        instrucoes.trim(),
        url_imagens
      )

      alert(`Item catalogado com sucesso! ${result.pontos_ganhos ? `+${result.pontos_ganhos} pontos` : ''}`)
      navigate('/meus-itens')
    } catch (err) {
      console.error('Erro ao catalogar item:', err)
      alert('Erro ao catalogar item: ' + (err.message || 'Erro desconhecido'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <header>
        <h1>📸 Catalogar Item</h1>
        <p>Adicione um item para doação</p>
      </header>

      <main>
        {/* FOTOS - CAMERA */}
        <section>
          <div className="card" style={{padding: '2rem', marginBottom: '1.5rem'}}>
            <h3 style={{marginBottom: '1rem'}}>📷 Fotos do Item ({formData.fotosPreview.length}/6)</h3>
            
            {/* Preview das fotos */}
            {formData.fotosPreview.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                {formData.fotosPreview.map((foto, index) => (
                  <div key={index} style={{position: 'relative'}}>
                    <img 
                      src={foto} 
                      alt={`Foto ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid #e5e7eb'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Câmera ativa */}
            {showCamera && (
              <div style={{marginBottom: '1rem'}}>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline
                  style={{
                    width: '100%',
                    maxHeight: '300px',
                    borderRadius: '8px',
                    background: '#000'
                  }}
                />
                <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.5rem'}}>
                  <button type="button" onClick={capturePhoto} style={{flex: 1}}>
                    📸 Capturar
                  </button>
                  <button type="button" onClick={stopCamera} style={{flex: 1, background: '#6b7280'}}>
                    ✕ Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Canvas oculto para captura */}
            <canvas ref={canvasRef} style={{display: 'none'}} />

            {/* Botões de adicionar foto */}
            {!showCamera && formData.fotos.length < 6 && (
              <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                <button type="button" onClick={startCamera}>
                  📷 Abrir Câmera
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  style={{display: 'none'}}
                />
                <button type="button" onClick={() => fileInputRef.current?.click()}>
                  📁 Escolher Arquivo
                </button>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  style={{display: 'none'}}
                  id="cameraInput"
                />
                <label htmlFor="cameraInput">
                  <span style={{
                    display: 'inline-block',
                    padding: '0.75rem 1.5rem',
                    background: '#10b981',
                    color: 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}>
                    📱 Câmera do Celular
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* FORMULÁRIO */}
          <form onSubmit={handleSubmit}>
            {/* INFORMAÇÕES BÁSICAS */}
            <div className="card" style={{padding: '2rem', marginBottom: '1.5rem'}}>
              <h3 style={{marginBottom: '1rem'}}>ℹ️ Informações Básicas</h3>

              <label htmlFor="titulo">Título do Item *</label>
              <input
                id="titulo"
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData(prev => ({...prev, titulo: e.target.value}))}
                placeholder="Ex: Telhas de cerâmica"
                required
              />

              <div className="grid" style={{gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label htmlFor="categoria">Categoria *</label>
                  <select
                    id="categoria"
                    value={formData.categoria}
                    onChange={(e) => {
                      const novaCat = e.target.value
                      setFormData(prev => ({
                        ...prev, 
                        categoria: novaCat,
                        subcategoria: categorias[novaCat][0]
                      }))
                    }}
                    required
                  >
                    {Object.keys(categorias).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="subcategoria">Tipo *</label>
                  <select
                    id="subcategoria"
                    value={formData.subcategoria}
                    onChange={(e) => setFormData(prev => ({...prev, subcategoria: e.target.value}))}
                    required
                  >
                    {categorias[formData.categoria].map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <label htmlFor="condicao">Condição do Item *</label>
              <select
                id="condicao"
                value={formData.condicao}
                onChange={(e) => setFormData(prev => ({...prev, condicao: e.target.value}))}
                required
              >
                <option value="Novo">Novo / Sem Uso</option>
                <option value="Bom">Bom Estado</option>
                <option value="Regular">Estado Regular</option>
                <option value="Precisa Reparo">Precisa Reparo</option>
              </select>

              <label htmlFor="descricao">Descrição *</label>
              <textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({...prev, descricao: e.target.value}))}
                placeholder="Descreva o item, suas características, dimensões, etc..."
                rows="4"
                required
              />
            </div>

            {/* LOCALIZAÇÃO */}
            <div className="card" style={{padding: '2rem', marginBottom: '1.5rem'}}>
              <h3 style={{marginBottom: '1rem'}}>📍 Localização</h3>

              <div className="grid" style={{gridTemplateColumns: '2fr 1fr', gap: '1rem'}}>
                <div>
                  <label htmlFor="cep">CEP *</label>
                  <input
                    id="cep"
                    type="text"
                    value={formData.cep}
                    onChange={(e) => setFormData(prev => ({...prev, cep: e.target.value}))}
                    placeholder="00000-000"
                    maxLength="9"
                    required
                  />
                </div>
                <div style={{display: 'flex', alignItems: 'flex-end'}}>
                  <button type="button" onClick={buscarCEP} style={{width: '100%'}}>
                    🔍 Buscar
                  </button>
                </div>
              </div>

              <label htmlFor="localizacao">Endereço / Localização *</label>
              <input
                id="localizacao"
                type="text"
                value={formData.localizacao}
                onChange={(e) => setFormData(prev => ({...prev, localizacao: e.target.value}))}
                placeholder="Rua, Bairro, Cidade"
                required
              />

              <label htmlFor="referencia">Ponto de Referência</label>
              <input
                id="referencia"
                type="text"
                value={formData.referencia}
                onChange={(e) => setFormData(prev => ({...prev, referencia: e.target.value}))}
                placeholder="Ex: Próximo ao mercado X, portão verde"
              />
            </div>

            {/* INSTRUÇÕES PARA COLETA */}
            <div className="card" style={{padding: '2rem', marginBottom: '1.5rem'}}>
              <h3 style={{marginBottom: '1rem'}}>📋 Instruções para Coleta</h3>

              <label htmlFor="comoRetirar">Como Retirar o Item?</label>
              <textarea
                id="comoRetirar"
                value={formData.comoRetirar}
                onChange={(e) => setFormData(prev => ({...prev, comoRetirar: e.target.value}))}
                placeholder="Ex: Item está na calçada, precisa de veículo grande, ajuda para carregar, etc."
                rows="3"
              />

              <label style={{marginTop: '1rem', display: 'block'}}>
                Dias Disponíveis para Retirada:
              </label>
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
                marginTop: '0.5rem'
              }}>
                {diasSemana.map(dia => (
                  <button
                    key={dia}
                    type="button"
                    onClick={() => toggleDia(dia)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: formData.diasDisponiveis.includes(dia) ? '#10b981' : '#f3f4f6',
                      color: formData.diasDisponiveis.includes(dia) ? 'white' : '#374151',
                      border: formData.diasDisponiveis.includes(dia) ? '2px solid #059669' : '2px solid #d1d5db',
                      borderRadius: '999px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: formData.diasDisponiveis.includes(dia) ? 'bold' : 'normal',
                      transition: 'all 0.2s'
                    }}
                  >
                    {dia}
                  </button>
                ))}
              </div>

              <div className="grid" style={{gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem'}}>
                <div>
                  <label htmlFor="horarioInicio">Horário de Início</label>
                  <input
                    id="horarioInicio"
                    type="time"
                    value={formData.horarioInicio}
                    onChange={(e) => setFormData(prev => ({...prev, horarioInicio: e.target.value}))}
                  />
                </div>
                <div>
                  <label htmlFor="horarioFim">Horário de Término</label>
                  <input
                    id="horarioFim"
                    type="time"
                    value={formData.horarioFim}
                    onChange={(e) => setFormData(prev => ({...prev, horarioFim: e.target.value}))}
                  />
                </div>
              </div>

              <label htmlFor="observacoesRetirada">Observações Adicionais</label>
              <textarea
                id="observacoesRetirada"
                value={formData.observacoesRetirada}
                onChange={(e) => setFormData(prev => ({...prev, observacoesRetirada: e.target.value}))}
                placeholder="Ex: Tocar campainha do apartamento 12, aguardar na portaria, ligar antes..."
                rows="3"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              style={{width: '100%', padding: '1rem', fontSize: '1rem', opacity: isLoading ? 0.7 : 1}}
            >
              {isLoading ? '⏳ Catalogando...' : '✅ Catalogar Item'}
            </button>
          </form>
        </section>

        {/* GUIA DE CATEGORIAS */}
        <section style={{marginTop: '2rem'}}>
          <details className="card" style={{padding: '1.5rem'}}>
            <summary style={{cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem'}}>
              📋 Guia de Categorias (clique para expandir)
            </summary>
            <div style={{marginTop: '1rem', fontSize: '0.9rem', lineHeight: '1.8'}}>
              <strong>Metais:</strong> Ferro, Alumínio, Cobre, Inox, Outros<br/>
              <strong>Plásticos:</strong> PET, PVC, PP, PS, PEAD, Outros<br/>
              <strong>Papel/Papelão:</strong> Caixas, Branco, Jornais e Revistas, Revestido<br/>
              <strong>Eletrônicos:</strong> Geladeira, Máquina Lavar, Microondas, TV, Eletroportátil, Celulares, Computadores, Impressoras<br/>
              <strong>Vidros:</strong> Vidros em geral<br/>
              <strong>Resíduos de Construção:</strong> Tijolos, Telhas, Cimento e Argamassa, Areia e Pedra, Azulejo e Cerâmica<br/>
              <strong>Madeiras:</strong> Bruta, Processada<br/>
              <strong>Resíduos Especiais:</strong> Pneus, Óleo, Óleo de Cozinha, Pilhas, Baterias, Lâmpadas Fluorescentes, Roupas, Tecidos e Retalhos
            </div>
          </details>
        </section>
      </main>
    </div>
  )
}

export default CatalogarItem