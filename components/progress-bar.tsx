import { Field, FieldLabel } from './ui/field'
import { Progress } from './ui/progress'

const ProgressBar = ({ progress, description }: { progress: number; description: string }) => {
  return (
    <Field className="w-full max-w-xl">
      <FieldLabel htmlFor="progress-upload">
        <span>{progress < 100 ? description : 'Completed'}</span>
        <span className="ml-auto">{progress}%</span>
      </FieldLabel>
      <Progress value={progress} id="progress-upload" />
    </Field>
  )
}
export default ProgressBar
