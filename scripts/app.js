/**
 * ============================================================================
 * CONSULTA FÁCIL — LÓGICA DE INTERAÇÃO, ACESSIBILIDADE E NAVEGAÇÃO
 * ============================================================================
 * Gerencia todas as telas do paciente, foco de teclado, WCAG e modo sênior.
 * ============================================================================
 */

(function () {
  'use strict';

  // Nomes dos dias da semana em português
  const DAY_NAMES = [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
    'Quinta-feira', 'Sexta-feira', 'Sábado'
  ];

  // Estado da aplicação
  const AppState = {
    currentTab: 'tela1',
    selectedAppointmentForReschedule: null,
    cancelTargetId: null
  };

  // Inicialização no DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    initSeniorMode();
    initMasks();
    renderAppointmentsList();
    populateSpecialtyDoctors();
    setupKeyboardListeners();
  });

  // ==========================================================================
  // NAVEGAÇÃO ENTRE ABAS DO PROTÓTIPO COM FOCO ACESSÍVEL
  // ==========================================================================
  window.switchTab = function (tabId) {
    AppState.currentTab = tabId;

    // Desativa todos os painéis e botões de abas
    document.querySelectorAll('.screen-panel').forEach(panel => {
      panel.classList.remove('active');
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });

    // Ativa o painel de destino
    const targetPanel = document.getElementById('panel-' + tabId);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }

    // Marca o botão da aba como ativo
    const activeBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
      activeBtn.setAttribute('aria-selected', 'true');
    }

    // Se navegou para a Tela 04, atualiza a lista de consultas
    if (tabId === 'tela4') {
      renderAppointmentsList();
    }

    // Anúncio acessível para leitores de tela
    announceToScreenReader(`Navegando para ${getTabTitle(tabId)}`);

    // Rolagem suave até o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  function getTabTitle(tabId) {
    switch (tabId) {
      case 'tela1': return 'Tela 1: Boas-Vindas e Acesso Rápido';
      case 'tela2': return 'Tela 2: Login Seguro';
      case 'tela3': return 'Tela 3: Novo Cadastro';
      case 'tela4': return 'Tela 4: Minhas Consultas e Perfil';
      case 'tela5': return 'Tela 5: Agendar Nova Consulta';
      case 'tela6': return 'Tela 6: Reagendar Consulta';
      case 'geral': return 'Aba de Visão Geral e Arquitetura Técnica';
      default: return 'Tela do Aplicativo';
    }
  }

  // ==========================================================================
  // MODO SÊNIOR (TIPOGRAFIA EXPANDIDA +20% & CONTRASTE REFORÇADO)
  // ==========================================================================
  function initSeniorMode() {
    const isSenior = localStorage.getItem('consulta_facil_senior_mode') === 'true';
    if (isSenior) {
      document.body.classList.add('senior-mode');
      updateSeniorButton(true);
    }
  }

  window.toggleSeniorMode = function () {
    const body = document.body;
    const isNowSenior = body.classList.toggle('senior-mode');
    localStorage.setItem('consulta_facil_senior_mode', isNowSenior);
    updateSeniorButton(isNowSenior);
    announceToScreenReader(
      isNowSenior
        ? 'Modo Sênior ativado: fontes ampliadas em vinte por cento e contraste reforçado.'
        : 'Modo Sênior desativado: tamanho de fonte padrão restaurado.'
    );
  };

  function updateSeniorButton(isActive) {
    const btn = document.getElementById('btnToggleSenior');
    if (!btn) return;
    if (isActive) {
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      btn.innerHTML = '<span>✓ Modo Sênior Ativado (Fontes +20%)</span>';
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
      btn.innerHTML = '<span>🔍 Modo Sênior (Fontes Ampliadas)</span>';
    }
  }

  // ==========================================================================
  // REVELAÇÃO BIMODAL DE SENHA ([ 👁️ Mostrar ] / [ 🙈 Ocultar ])
  // ==========================================================================
  window.togglePasswordVisibility = function (inputId, btnId) {
    const input = document.getElementById(inputId);
    const btn = document.getElementById(btnId);
    if (!input || !btn) return;

    if (input.type === 'password') {
      input.type = 'text';
      btn.innerHTML = '🙈 Ocultar';
      btn.setAttribute('aria-label', 'Ocultar senha');
      announceToScreenReader('Senha visível em texto legível.');
    } else {
      input.type = 'password';
      btn.innerHTML = '👁️ Mostrar';
      btn.setAttribute('aria-label', 'Mostrar senha');
      announceToScreenReader('Senha oculta.');
    }
  };

  // ==========================================================================
  // MÁSCARAS AUTOMÁTICAS ASSISTIDAS (CPF, TELEFONE E DATA)
  // ==========================================================================
  function initMasks() {
    // Máscara de CPF: 000.000.000-00
    document.querySelectorAll('[data-mask="cpf"]').forEach(input => {
      input.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 11) v = v.substring(0, 11);
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = v;
      });
    });

    // Máscara de Telefone: (00) 00000-0000
    document.querySelectorAll('[data-mask="phone"]').forEach(input => {
      input.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 11) v = v.substring(0, 11);
        v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
        v = v.replace(/(\d{5})(\d{4})$/, '$1-$2');
        e.target.value = v;
      });
    });

    // Máscara de Data: DD/MM/AAAA
    document.querySelectorAll('[data-mask="date"]').forEach(input => {
      input.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 8) v = v.substring(0, 8);
        v = v.replace(/(\d{2})(\d)/, '$1/$2');
        v = v.replace(/(\d{2})(\d)/, '$1/$2');
        e.target.value = v;
      });
    });
  }

  // ==========================================================================
  // SELEÇÃO ERGONÔMICA EM CHIPS DE HORÁRIO 2x2
  // ==========================================================================
  window.selectChip = function (btn) {
    const parent = btn.parentElement;
    parent.querySelectorAll('.time-chip').forEach(c => {
      c.classList.remove('selected');
      c.setAttribute('aria-checked', 'false');
      c.innerHTML = c.innerText.replace('✓ ', '');
    });
    btn.classList.add('selected');
    btn.setAttribute('aria-checked', 'true');
    btn.innerHTML = '✓ ' + btn.innerText;
    announceToScreenReader('Horário selecionado: ' + btn.innerText);
  };

  // ==========================================================================
  // MINI CALENDÁRIO RETRÁTIL SOB DEMANDA (TELA 04 E TELA 05)
  // ==========================================================================
  window.toggleMiniCalendar = function (calendarId, hintId) {
    const cal = document.getElementById(calendarId || 'miniCalendar');
    const hint = document.getElementById(hintId || 'calHint');
    if (!cal) return;

    cal.classList.toggle('open');
    const isOpen = cal.classList.contains('open');

    if (isOpen) {
      if (hint) hint.innerText = 'Toque em um dia útil para escolher e fechar:';
      announceToScreenReader('Calendário mensal aberto. Escolha um dia.');
    } else {
      if (hint) hint.innerText = 'Toque acima para abrir o calendário';
    }
  };

  window.selectDate = function (day, month, year, dayOfWeekIndex, btn, event, targetInputId, calendarId, hintId) {
    if (event) event.stopPropagation();

    const calEl = document.getElementById(calendarId || 'miniCalendar');
    if (calEl) {
      calEl.querySelectorAll('.cal-day').forEach(d => d.classList.remove('selected'));
    }
    if (btn) btn.classList.add('selected');

    const dayName = DAY_NAMES[dayOfWeekIndex];
    const dayPadded = day < 10 ? '0' + day : day;
    const monthPadded = month < 10 ? '0' + month : month;
    const fullDateStr = `${dayName}, ${dayPadded}/${monthPadded}/${year}`;

    const inputEl = document.getElementById(targetInputId || 'reag-data');
    if (inputEl) {
      inputEl.value = fullDateStr;
      inputEl.style.borderColor = '#16A34A';
      setTimeout(() => {
        inputEl.style.borderColor = '#0284C7';
      }, 400);
    }

    // Feedback no leitor de tela
    announceToScreenReader(`Data escolhida: ${fullDateStr}`);

    // Fecha o calendário suavemente após a seleção para poupar espaço vertical
    setTimeout(() => {
      if (calEl) calEl.classList.remove('open');
      const hint = document.getElementById(hintId || 'calHint');
      if (hint) {
        hint.innerText = `✓ Data selecionada: ${dayPadded}/${monthPadded}. Toque para trocar.`;
        hint.style.color = '#16A34A';
        setTimeout(() => {
          hint.style.color = 'var(--text-muted)';
          hint.innerText = 'Toque acima para abrir o calendário';
        }, 3500);
      }
    }, 180);
  };

  // ==========================================================================
  // RENDERIZAÇÃO DA LISTA DE CONSULTAS (TELA 04: MINHAS CONSULTAS)
  // ==========================================================================
  function renderAppointmentsList() {
    const listContainer = document.getElementById('consultas-ativas-lista');
    const historicoContainer = document.getElementById('consultas-historico-lista');
    const contadorBadge = document.getElementById('badge-total-consultas');

    if (!listContainer) return;

    const { ativas, passadas } = window.ConsultaFacilServices.AppointmentService.getAppointmentsForCurrentPatient();

    if (contadorBadge) {
      contadorBadge.innerText = `${ativas.length} agendada${ativas.length !== 1 ? 's' : ''}`;
    }

    // Renderiza Consultas Ativas
    if (ativas.length === 0) {
      listContainer.innerHTML = `
        <div style="background:#FFFFFF; border:2px dashed #94A3B8; border-radius:12px; padding:20px; text-align:center;">
          <p style="font-size:16px; font-weight:700; color:#334155; margin-bottom:8px;">Você não possui consultas agendadas no momento.</p>
          <button class="btn-mobile-primary" style="min-height:48px;" onclick="switchTab('tela5')">➕ Marcar Minha Primeira Consulta</button>
        </div>
      `;
    } else {
      listContainer.innerHTML = ativas.map(c => `
        <article class="appointment-card active-border" aria-label="Consulta com ${c.medicoNome}, ${c.especialidade}">
          <div class="appointment-header">
            <div>
              <div class="doctor-name">${c.medicoNome}</div>
              <span class="specialty-badge">${c.especialidade}</span>
            </div>
            <span class="status-badge confirmada">Confirmada</span>
          </div>

          <div class="appointment-details">
            <div>📅 <strong>${c.diaSemana}, ${c.data}</strong> às <strong>${c.horario}</strong></div>
            <div>🏥 ${c.unidade}</div>
            <div style="font-size:12.5px; color:#475569; margin-top:2px;">ℹ️ ${c.observacao}</div>
          </div>

          <div class="appointment-actions">
            <button class="btn-card-action btn-card-reschedule" onclick="prepararReagendamento('${c.id}')" aria-label="Mudar dia ou hora da consulta com ${c.medicoNome}">
              🔄 Mudar Dia / Hora
            </button>
            <button class="btn-card-action btn-card-cancel" onclick="abrirModalCancelamento('${c.id}')" aria-label="Cancelar consulta com ${c.medicoNome}">
              ✕ Cancelar
            </button>
          </div>
        </article>
      `).join('');
    }

    // Renderiza Histórico Passado
    if (historicoContainer) {
      if (passadas.length === 0) {
        historicoContainer.innerHTML = '<p style="color:#64748B; font-size:14px; padding:8px 0;">Nenhum registro anterior encontrado.</p>';
      } else {
        historicoContainer.innerHTML = passadas.map(c => `
          <div class="appointment-card history-card" style="margin-bottom:8px; padding:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <strong>${c.medicoNome} (${c.especialidade})</strong>
              <span class="status-badge ${c.status.toLowerCase()}">${c.status === 'REALIZADA' ? 'Realizada' : 'Cancelada'}</span>
            </div>
            <div style="font-size:13px; color:#475569; margin-top:4px;">
              Data: ${c.data} • ${c.horario}
            </div>
          </div>
        `).join('');
      }
    }
  }

  // Prepara a Tela 06 com a consulta selecionada
  window.prepararReagendamento = function (consultaId) {
    const all = window.ConsultaFacilServices.AppointmentService.getAll();
    const consulta = all.find(c => c.id === consultaId) || all[0];
    AppState.selectedAppointmentForReschedule = consulta;

    // Atualiza o card de resumo na Tela 06
    const resumoEl = document.getElementById('reag-resumo-card');
    if (resumoEl && consulta) {
      resumoEl.innerHTML = `
        <span style="font-size:calc(12px * var(--font-scale)); font-weight:800; color:#1D4ED8; text-transform:uppercase;">
          📅 Consulta que você quer mudar:
        </span>
        <div style="font-size:calc(18px * var(--font-scale)); font-weight:800; color:#0F172A;">
          ${consulta.medicoNome}
        </div>
        <div style="font-size:calc(15px * var(--font-scale)); color:#1E3A8A; font-weight:700;">
          ${consulta.especialidade} • ${consulta.crm}
        </div>
        <div style="font-size:calc(14px * var(--font-scale)); color:#334155; margin-top:2px;">
          Horário atual: <strong>${consulta.diaSemana}, ${consulta.data} às ${consulta.horario}</strong><br>
          Local: ${consulta.unidade}
        </div>
      `;
    }

    switchTab('tela6');
  };

  // ==========================================================================
  // CONFIRMAÇÃO DE REAGENDAMENTO (TELA 06)
  // ==========================================================================
  window.confirmarReagendamento = function () {
    const dataInput = document.getElementById('reag-data');
    const novaData = dataInput ? dataInput.value : 'Quinta-feira, 15/10/2026';
    const chipSelected = document.querySelector('#panel-tela6 .time-chip.selected');
    const novoHorario = chipSelected ? chipSelected.innerText.replace('✓ ', '').trim() : '10:30 (Manhã)';

    const id = AppState.selectedAppointmentForReschedule?.id || 'CONS-901';

    window.ConsultaFacilServices.AppointmentService.reschedule(id, novaData.replace(/^.*?, /, ''), novoHorario)
      .then(() => {
        alert(`✓ Consulta reagendada com sucesso!\n\nNovo dia: ${novaData}\nHorário: ${novoHorario}\n\nEnviamos a confirmação para seu WhatsApp.`);
        switchTab('tela4');
      });
  };

  // ==========================================================================
  // FLUXO DE NOVA CONSULTA (TELA 05)
  // ==========================================================================
  function populateSpecialtyDoctors() {
    const specSelect = document.getElementById('nova-especialidade');
    const docSelect = document.getElementById('nova-medico');
    if (!specSelect || !docSelect) return;

    specSelect.addEventListener('change', () => {
      const spec = specSelect.value;
      const docs = window.ConsultaFacilServices.DoctorService.getBySpecialty(spec);
      docSelect.innerHTML = docs.map(d => `
        <option value="${d.id}">${d.nome} (${d.crm})</option>
      `).join('');
    });
  }

  window.confirmarNovoAgendamento = function (e) {
    if (e) e.preventDefault();
    const docSelect = document.getElementById('nova-medico');
    const medicoId = docSelect ? docSelect.value : 1;
    const dataInput = document.getElementById('nova-data');
    const data = dataInput ? dataInput.value : 'Sexta-feira, 23/10/2026';
    const chip = document.querySelector('#panel-tela5 .time-chip.selected');
    const horario = chip ? chip.innerText.replace('✓ ', '').trim() : '09:00 (Manhã)';

    window.ConsultaFacilServices.AppointmentService.createAppointment({
      medicoId,
      data: data.replace(/^.*?, /, ''),
      horario,
      observacao: 'Consulta marcada pelo paciente no aplicativo.'
    }).then(res => {
      alert(`✓ Nova consulta confirmada com sucesso!\n\nMédico: ${res.appointment.medicoNome}\nData: ${data}\nHorário: ${horario}\nLocal: ${res.appointment.unidade}`);
      switchTab('tela4');
    });
  };

  // ==========================================================================
  // CANCELAMENTO SEGURO COM MODAL DE DUPLA CONFIRMAÇÃO
  // ==========================================================================
  window.abrirModalCancelamento = function (id) {
    AppState.cancelTargetId = id;
    const modal = document.getElementById('modal-cancelamento-seguro');
    if (modal) {
      modal.style.display = 'flex';
      const btnConfirmar = document.getElementById('btnConfirmarCancelamento');
      if (btnConfirmar) btnConfirmar.focus();
    }
  };

  window.fecharModalCancelamento = function () {
    const modal = document.getElementById('modal-cancelamento-seguro');
    if (modal) modal.style.display = 'none';
    AppState.cancelTargetId = null;
  };

  window.executarCancelamento = function () {
    if (!AppState.cancelTargetId) return;
    window.ConsultaFacilServices.AppointmentService.cancel(AppState.cancelTargetId)
      .then(() => {
        fecharModalCancelamento();
        renderAppointmentsList();
        alert('✓ A consulta foi cancelada com segurança.\nO horário foi liberado no sistema.');
      });
  };

  // ==========================================================================
  // AUTENTICAÇÃO E CADASTRO (FORMULÁRIOS DAS TELAS 02 E 03)
  // ==========================================================================
  window.handleLoginSubmit = function (e) {
    e.preventDefault();
    const user = document.getElementById('login-user').value;
    const pwd = document.getElementById('login-pwd').value;

    window.ConsultaFacilServices.AuthService.login(user, pwd)
      .then(res => {
        alert(`✓ Bem-vindo(a) de volta, ${res.user.nome}!\nAcessando sua área de consultas.`);
        switchTab('tela4');
      });
  };

  window.handleRegisterSubmit = function (e) {
    e.preventDefault();
    const nome = document.getElementById('cad-nome').value;
    const cpf = document.getElementById('cad-cpf').value;
    const dataNascimento = document.getElementById('cad-nasc').value;
    const telefone = document.getElementById('cad-tel').value;

    window.ConsultaFacilServices.AuthService.register({ nome, cpf, dataNascimento, telefone })
      .then(res => {
        alert(`✓ Cadastro concluído com sucesso, ${res.user.nome}!\nVocê já pode marcar suas consultas.`);
        switchTab('tela4');
      });
  };

  window.handleLogout = function () {
    if (confirm('Deseja realmente sair da sua conta?')) {
      window.ConsultaFacilServices.AuthService.logout().then(() => {
        switchTab('tela1');
      });
    }
  };

  // ==========================================================================
  // ACESSIBILIDADE DE TECLADO (TECLA ESC E GERENCIAMENTO DE FOCO)
  // ==========================================================================
  function setupKeyboardListeners() {
    document.addEventListener('keydown', (e) => {
      // Tecla Esc fecha modais abertos
      if (e.key === 'Escape' || e.key === 'Esc') {
        fecharModalCancelamento();
        const cal = document.getElementById('miniCalendar');
        if (cal && cal.classList.contains('open')) {
          cal.classList.remove('open');
        }
        const calNova = document.getElementById('miniCalendarNova');
        if (calNova && calNova.classList.contains('open')) {
          calNova.classList.remove('open');
        }
      }
    });
  }

  // Anúncio dinâmico para leitor de tela (região live acessível)
  function announceToScreenReader(message) {
    const liveRegion = document.getElementById('sr-announcements');
    if (liveRegion) {
      liveRegion.innerText = '';
      setTimeout(() => {
        liveRegion.innerText = message;
      }, 50);
    }
  }

})();
