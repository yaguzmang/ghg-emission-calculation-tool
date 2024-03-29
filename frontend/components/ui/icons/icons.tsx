import ArrowOutward from './arrow_outward.svg';
import ArrowsDown from './arrows-down.svg';
import ArrowsDownSmall from './arrows-down-small.svg';
import Check from './check.svg';
import ChevronDown from './chevron-down.svg';
import DirectEmissions from './DirectEmissions.svg';
import Edit from './edit.svg';
import Flowsheet from './flowsheet.svg';
import FolderData from './folder_data.svg';
import HalfCircle from './half-circle.svg';
import HelpCircleFilled from './help-circle-filled.svg';
import IndirectEmissions from './IndirectEmissions.svg';
import Movie from './movie.svg';
import NotchDown from './notch-down.svg';
import QuestionMark from './question-mark.svg';
import Search from './search.svg';
import TallinnaTehnikaulikool from './tallinna-tehnikaulikool.svg';
import Trash from './trash.svg';
import Undo from './undo.svg';
import Union from './union.svg';
import UserAvatar from './user-avatar.svg';
import ValueChainEmissions from './ValueChainEmissions.svg';
import X from './x.svg';

import { EmissionScope } from '@/types/emission-scope';

export const Icons = {
  Close: X,
  QuestionMark,
  Search,
  ChevronDown,
  Check,
  TallinnaTehnikaulikool,
  UserAvatar,
  NotchDown,
  HelpCircleFilled,
  DirectEmissions,
  IndirectEmissions,
  ValueChainEmissions,
  Edit,
  Undo,
  Union,
  Trash,
  ArrowsDown,
  ArrowsDownSmall,
  HalfCircle,
  ArrowOutward,
  Flowsheet,
  FolderData,
  Movie,
};

export const EmissionIconsByScope = {
  [EmissionScope.direct]: <Icons.DirectEmissions />,
  [EmissionScope.indirect]: <Icons.IndirectEmissions />,
  [EmissionScope.valueChain]: <Icons.ValueChainEmissions />,
};
