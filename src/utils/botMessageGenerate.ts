import { RoleBody, RoleType, VOCType } from '@/@types';
import { rootStore } from '@/stores';
export const generateVOCMessage = (
  type?: VOCType,
  vocId?: string,
): { title: string; content: string } => {
  switch (type) {
    case 'voc-created-department':
      return {
        title: 'VOC가 신규 접수되었습니다.',
        content: `#${vocId}를 확인하여 처리부서를 지정해 주세요.`,
      };
    case 'voc-created-manager':
      return {
        title: 'VOC가 신규 접수되었습니다.',
        content: `#${vocId}를 확인하여 담당자를 지정해 주세요.`,
      };
    case 'voc-assigned-department':
      return {
        title: 'VOC 담당 부서로 지정되었습니다.',
        content: `#${vocId}를 확인하여 담당자를 지정해 주세요.`,
      };
    case 'voc-assigned-manager':
      return {
        title: 'VOC 담당자로 지정되었습니다.',
        content: `#${vocId}를 확인하여 답변을 작성해 주세요.`,
      };
    case 'voc-assigned-approver':
      return {
        title: 'VOC 승인자로 지정되었습니다.',
        content: `#${vocId}를 확인하여 결재를 승인해 주세요.`,
      };
    case 'voc-assigned-previewer':
      return {
        title: 'VOC 선람자로 지정되었습니다.',
        content: `#${vocId}를 확인하여 결재를 승인해 주세요.`,
      };
    case 'voc-type-changed':
      return {
        title: 'VOC의 유형이 변경되었습니다.',
        content: `#${vocId}를 확인하여 처리 부서를 지정해 주세요.`,
      };
    case 'voc-department-revoked':
      return {
        title: 'VOC의 처리부서가 회수되었습니다.',
        content: `#${vocId}를 확인하여 처리부서를 재지정해 주세요.`,
      };
    case 'voc-manager-revoked':
      return {
        title: 'VOC의 담당자가 회수되었습니다.',
        content: `#${vocId}를 확인하여 담당자를 재지정해 주세요.`,
      };
    case 'voc-approval-rejected':
      return {
        title: 'VOC의 결재가 반려되었습니다.',
        content: `#${vocId}를 확인하여 문서를 재상신해 주세요.`,
      };
    case 'voc-approval-approved':
      return {
        title: `VOC#${vocId}의 결재가 승인되었습니다.`,
        content: '',
      };
    case 'voc-deadline-tomorrow':
      return {
        title: 'VOC의 처리기한이 내일 만료됩니다.',
        content: `#${vocId}의 기한이 끝나기 전에 답변을 작성해 주세요.`,
      };
    case 'voc-deadline-expired':
      return {
        title: 'VOC의 처리기한이 만료되었습니다.',
        content: `#${vocId}를 확인해주세요.`,
      };
    case 'voc-withdrawn-by-citizen':
      return {
        title: `민원인이 VOC#${vocId}를 취하하였습니다.`,
        content: '',
      };
    case 'voc-withdrawn-by-admin':
      return {
        title: `관리자가 VOC#${vocId}를 취하하였습니다.`,
        content: '',
      };
    default:
      return {
        title: '',
        content: '',
      };
  }
};

export const getSystemLevel = (level: number) => {
  switch (level) {
    case 1:
      return '마스터';
    case 2:
      return '부마스터';
    case 3:
      return '운영진';
    case 4:
      return '사원';
    default:
      return '';
  }
};

export const generateRoleMessage = async (
  type?: RoleType,
  roleBody?: RoleBody,
): Promise<{ title: string; content: string }> => {
  switch (type) {
    case 'role-user-grade-changed':
      if (roleBody?.employeePersonaId) {
        await rootStore.coreStore?.personaStore.fetchPersona({
          personaId: roleBody.employeePersonaId,
        });
      }
      const employeePersonaName =
        rootStore.coreStore?.personaStore.getPersona(
          roleBody?.employeePersonaId ?? -1,
        )?.nick ?? '';
      const beforeLevel = getSystemLevel(roleBody?.beforeLevel ?? -1);
      const afterLevel = getSystemLevel(roleBody?.afterLevel ?? -1);
      return {
        title: `${employeePersonaName}님의 시스템 등급이 ${beforeLevel}에서 ${afterLevel}(으)로 변경되었습니다.`,
        content: '',
      };
    case 'role-master-privilege-transferred':
      await rootStore.coreStore?.personaStore.fetchPersonaList({
        personaIdList: [
          roleBody?.beforeMasterPersonaId,
          roleBody?.afterMasterPersonaId,
        ] as number[],
      });
      const beforeMasterPersonaName =
        rootStore.coreStore?.personaStore.getPersona(
          roleBody?.beforeMasterPersonaId ?? -1,
        )?.nick ?? '';
      const afterMasterPersonaName =
        rootStore.coreStore?.personaStore.getPersona(
          roleBody?.afterMasterPersonaId ?? -1,
        )?.nick ?? '';
      return {
        title: `${beforeMasterPersonaName}님이 마스터 권한을 ${afterMasterPersonaName}님에게 이관하였습니다.`,
        content: '',
      };
    default:
      return {
        title: '',
        content: '',
      };
  }
};
