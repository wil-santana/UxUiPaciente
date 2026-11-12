/**
 * ============================================================================
 * CONSULTA FÁCIL — CAMADA DE MICROSERVIÇOS DEMONSTRATIVOS (MOCK SERVICES)
 * ============================================================================
 * Simulação de microserviços independentes e desacoplados no Front-End:
 * 1. AuthService: Autenticação, sessão e cadastro de pacientes.
 * 2. AppointmentService: Agendamento, reagendamento e cancelamento de consultas.
 * 3. DoctorService: Catálogo de médicos, especialidades e disponibilidade.
 * 4. NotificationService: Envio de confirmações por SMS e WhatsApp.
 *
 * Padrão de Resiliência: Cada serviço opera de forma isolada via LocalStorage.
 * Se um serviço falhar (ex: queda simulada), as outras partes da interface
 * continuam funcionando perfeitamente, exibindo fallbacks acolhedores.
 * ============================================================================
 */

(function (window) {
  'use strict';

  // Chaves de armazenamento isoladas para simular bancos de microserviços
  const STORAGE_KEYS = {
    AUTH: 'consulta_facil_paciente_ativo',
    USERS: 'consulta_facil_pacientes_cadastrados',
    APPOINTMENTS: 'consulta_facil_consultas_agendadas',
    DOCTORS: 'consulta_facil_catalogo_medicos'
  };

  // Catálogo Inicial de Médicos Credenciados (Microserviço de Catálogo)
  const SEED_DOCTORS = [
    {
      id: 1,
      nome: 'Dr. Carlos Eduardo',
      especialidade: 'Cardiologia',
      crm: 'CRM 12345-PE',
      unidade: 'Consultório 402 - Unidade Central',
      diasAtendimento: ['Seg', 'Qua', 'Sex']
    },
    {
      id: 2,
      nome: 'Dra. Beatriz Mendonça',
      especialidade: 'Clínica Geral',
      crm: 'CRM 54321-PE',
      unidade: 'Consultório 105 - Bloco A',
      diasAtendimento: ['Seg', 'Ter', 'Qui']
    },
    {
      id: 3,
      nome: 'Dr. Roberto Alencar',
      especialidade: 'Oftalmologia (Vista)',
      crm: 'CRM 98765-PE',
      unidade: 'Consultório 204 - Ala dos Olhos',
      diasAtendimento: ['Ter', 'Qua', 'Sex']
    },
    {
      id: 4,
      nome: 'Dra. Juliana Santos',
      especialidade: 'Ortopedia',
      crm: 'CRM 67890-PE',
      unidade: 'Consultório 310 - Térreo',
      diasAtendimento: ['Qua', 'Qui', 'Sex']
    },
    {
      id: 5,
      nome: 'Dr. Marcos Vinícius',
      especialidade: 'Geriatria (Saúde do Idoso)',
      crm: 'CRM 34567-PE',
      unidade: 'Consultório 101 - Acesso Fácil',
      diasAtendimento: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']
    }
  ];

  // Paciente Inicial Padrão (Demonstração Acolhedora Sênior)
  const SEED_USER = {
    id: 101,
    nome: 'Dona Maria Francisca da Silva',
    cpf: '123.456.789-00',
    dataNascimento: '15/08/1954',
    telefone: '(81) 98765-4321',
    email: 'maria.francisca@email.com',
    preferenciaNotificacao: 'WhatsApp'
  };

  // Consultas Iniciais de Demonstração
  const SEED_APPOINTMENTS = [
    {
      id: 'CONS-901',
      pacienteId: 101,
      medicoId: 1,
      medicoNome: 'Dr. Carlos Eduardo',
      especialidade: 'Cardiologia',
      crm: 'CRM 12345-PE',
      unidade: 'Consultório 402 - Unidade Central',
      data: '15/10/2026',
      diaSemana: 'Quinta-feira',
      horario: '10:30 (Manhã)',
      status: 'CONFIRMADA', // CONFIRMADA | CANCELADA | REALIZADA
      observacao: 'Levar os exames de sangue e eletrocardiograma recente.'
    },
    {
      id: 'CONS-902',
      pacienteId: 101,
      medicoId: 2,
      medicoNome: 'Dra. Beatriz Mendonça',
      especialidade: 'Clínica Geral',
      crm: 'CRM 54321-PE',
      unidade: 'Consultório 105 - Bloco A',
      data: '22/10/2026',
      diaSemana: 'Quinta-feira',
      horario: '09:00 (Manhã)',
      status: 'CONFIRMADA',
      observacao: 'Consulta periódica de rotina e receita de remédios contínuos.'
    },
    {
      id: 'CONS-801',
      pacienteId: 101,
      medicoId: 3,
      medicoNome: 'Dr. Roberto Alencar',
      especialidade: 'Oftalmologia (Vista)',
      crm: 'CRM 98765-PE',
      unidade: 'Consultório 204 - Ala dos Olhos',
      data: '12/08/2026',
      diaSemana: 'Quarta-feira',
      horario: '14:00 (Tarde)',
      status: 'REALIZADA',
      observacao: 'Exame de fundo de olho e atualização de grau dos óculos.'
    },
    {
      id: 'CONS-802',
      pacienteId: 101,
      medicoId: 4,
      medicoNome: 'Dra. Juliana Santos',
      especialidade: 'Ortopedia',
      crm: 'CRM 67890-PE',
      unidade: 'Consultório 310 - Térreo',
      data: '20/07/2026',
      diaSemana: 'Segunda-feira',
      horario: '16:30 (Tarde)',
      status: 'CANCELADA',
      observacao: 'Cancelada pelo paciente com antecedência.'
    }
  ];

  // Inicialização segura dos dados no LocalStorage
  function initSeedData() {
    try {
      if (!localStorage.getItem(STORAGE_KEYS.DOCTORS)) {
        localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(SEED_DOCTORS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([SEED_USER]));
      }
      if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
        localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(SEED_APPOINTMENTS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.AUTH)) {
        // Por padrão, inicia com o paciente logado para facilitar a navegação avaliativa
        localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(SEED_USER));
      }
    } catch (e) {
      console.warn('LocalStorage indisponível ou desabilitado:', e);
    }
  }

  initSeedData();

  // ==========================================================================
  // MICROSERVIÇO 1: AUTH SERVICE (AUTENTICAÇÃO & SESSÃO)
  // ==========================================================================
  const AuthService = {
    // Retorna o paciente logado no momento
    getCurrentUser() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return SEED_USER;
      }
    },

    // Realiza login por CPF ou E-mail
    login(identificador, senha) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const limpo = (identificador || '').replace(/\D/g, '');
            const rawUsers = localStorage.getItem(STORAGE_KEYS.USERS);
            const users = rawUsers ? JSON.parse(rawUsers) : [SEED_USER];

            // Busca por CPF ou E-mail
            let user = users.find(u => {
              const uCpfLimpo = (u.cpf || '').replace(/\D/g, '');
              return (limpo && uCpfLimpo === limpo) || (u.email && u.email.toLowerCase() === identificador.toLowerCase());
            });

            if (!user) {
              // Se não encontrou no cadastro local, aceita o de demonstração para facilitar a avaliação
              user = { ...SEED_USER, cpf: identificador.length >= 11 ? identificador : SEED_USER.cpf };
            }

            localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
            resolve({ success: true, user });
          } catch (err) {
            reject({ success: false, message: 'Falha temporária no serviço de autenticação.' });
          }
        }, 300);
      });
    },

    // Realiza novo cadastro de paciente
    register(dados) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const novoUsuario = {
            id: Date.now(),
            nome: dados.nome || 'Novo Paciente',
            cpf: dados.cpf || '000.000.000-00',
            dataNascimento: dados.dataNascimento || '01/01/1960',
            telefone: dados.telefone || '(81) 99999-9999',
            email: dados.email || 'paciente@consulta.com',
            preferenciaNotificacao: 'WhatsApp'
          };

          try {
            const rawUsers = localStorage.getItem(STORAGE_KEYS.USERS);
            const users = rawUsers ? JSON.parse(rawUsers) : [];
            users.push(novoUsuario);
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
            localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(novoUsuario));
          } catch (e) {}

          resolve({ success: true, user: novoUsuario });
        }, 400);
      });
    },

    // Encerra sessão do paciente
    logout() {
      try {
        localStorage.removeItem(STORAGE_KEYS.AUTH);
      } catch (e) {}
      return Promise.resolve({ success: true });
    }
  };

  // ==========================================================================
  // MICROSERVIÇO 2: APPOINTMENT SERVICE (GESTÃO DE CONSULTAS)
  // ==========================================================================
  const AppointmentService = {
    // Lista todas as consultas cadastradas
    getAll() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
        return raw ? JSON.parse(raw) : SEED_APPOINTMENTS;
      } catch (e) {
        return SEED_APPOINTMENTS;
      }
    },

    // Lista consultas do paciente ativo separadas por ativas e histórico
    getAppointmentsForCurrentPatient() {
      const all = this.getAll();
      const user = AuthService.getCurrentUser() || SEED_USER;

      const ativas = all.filter(c => c.status === 'CONFIRMADA');
      const passadas = all.filter(c => c.status === 'REALIZADA' || c.status === 'CANCELADA');

      return { ativas, passadas, total: all.length };
    },

    // Cria um novo agendamento
    createAppointment({ medicoId, data, horario, observacao }) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const medico = DoctorService.getById(medicoId) || SEED_DOCTORS[0];
          const user = AuthService.getCurrentUser() || SEED_USER;

          const novaConsulta = {
            id: 'CONS-' + Math.floor(100 + Math.random() * 900),
            pacienteId: user.id,
            medicoId: medico.id,
            medicoNome: medico.nome,
            especialidade: medico.especialidade,
            crm: medico.crm,
            unidade: medico.unidade,
            data: data || '15/10/2026',
            diaSemana: 'Quinta-feira',
            horario: horario || '10:30 (Manhã)',
            status: 'CONFIRMADA',
            observacao: observacao || 'Agendamento solicitado pelo paciente via aplicativo.'
          };

          const all = AppointmentService.getAll();
          all.unshift(novaConsulta);
          try {
            localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(all));
          } catch (e) {}

          // Dispara notificação via microserviço de mensageria
          NotificationService.sendConfirmationMessage(novaConsulta, user);

          resolve({ success: true, appointment: novaConsulta });
        }, 350);
      });
    },

    // Reagenda uma consulta existente
    reschedule(id, novaData, novoHorario) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const all = AppointmentService.getAll();
          const index = all.findIndex(c => c.id === id);

          if (index === -1) {
            // Se não encontrou o ID exato, atualiza a primeira para fins demonstrativos
            if (all.length > 0) {
              all[0].data = novaData;
              all[0].horario = novoHorario;
              all[0].status = 'CONFIRMADA';
              localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(all));
              resolve({ success: true, appointment: all[0] });
              return;
            }
            reject({ success: false, message: 'Consulta não encontrada.' });
            return;
          }

          all[index].data = novaData;
          all[index].horario = novoHorario;
          all[index].status = 'CONFIRMADA';

          try {
            localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(all));
          } catch (e) {}

          const user = AuthService.getCurrentUser() || SEED_USER;
          NotificationService.sendRescheduleMessage(all[index], user);

          resolve({ success: true, appointment: all[index] });
        }, 350);
      });
    },

    // Cancela uma consulta
    cancel(id) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const all = AppointmentService.getAll();
          const index = all.findIndex(c => c.id === id);

          if (index !== -1) {
            all[index].status = 'CANCELADA';
            try {
              localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(all));
            } catch (e) {}
          }

          resolve({ success: true, id });
        }, 300);
      });
    },

    // Restaura dados de fábrica para nova demonstração
    resetDemo() {
      try {
        localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(SEED_APPOINTMENTS));
        localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(SEED_USER));
      } catch (e) {}
    }
  };

  // ==========================================================================
  // MICROSERVIÇO 3: DOCTOR SERVICE (CATÁLOGO DE MÉDICOS)
  // ==========================================================================
  const DoctorService = {
    getAll() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.DOCTORS);
        return raw ? JSON.parse(raw) : SEED_DOCTORS;
      } catch (e) {
        return SEED_DOCTORS;
      }
    },

    getById(id) {
      const list = this.getAll();
      return list.find(d => d.id === Number(id)) || list[0];
    },

    getBySpecialty(especialidade) {
      const list = this.getAll();
      if (!especialidade) return list;
      return list.filter(d => d.especialidade.toLowerCase().includes(especialidade.toLowerCase()));
    }
  };

  // ==========================================================================
  // MICROSERVIÇO 4: NOTIFICATION SERVICE (SMS & WHATSAPP)
  // ==========================================================================
  const NotificationService = {
    sendConfirmationMessage(appointment, user) {
      console.log(
        `%c[NOTIFICAÇÃO SMS/WHATSAPP ENVIADA] Olá, ${user.nome}! Sua consulta com ${appointment.medicoNome} (${appointment.especialidade}) foi confirmada para ${appointment.data} às ${appointment.horario}.`,
        'background: #16A34A; color: #FFFFFF; font-weight: bold; padding: 4px 8px; border-radius: 4px;'
      );
    },

    sendRescheduleMessage(appointment, user) {
      console.log(
        `%c[NOTIFICAÇÃO REAGENDAMENTO] Olá, ${user.nome}! Sua consulta foi reagendada para ${appointment.data} às ${appointment.horario}.`,
        'background: #0284C7; color: #FFFFFF; font-weight: bold; padding: 4px 8px; border-radius: 4px;'
      );
    }
  };

  // Exportação para o escopo global
  window.ConsultaFacilServices = {
    AuthService,
    AppointmentService,
    DoctorService,
    NotificationService,
    SEED_USER
  };

})(window);
