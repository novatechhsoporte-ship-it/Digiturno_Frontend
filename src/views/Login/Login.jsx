import { useAuth } from "@/hooks/auth/useAuth";
import "./Login.scss";

export const Login = () => {
  const { register, handleSubmit, errors, isSubmitting, isDisabled, submit } = useAuth();

  return (
    <div className='login'>
      {/* Brand / Left */}
      <div className='login__brand'>
        <div className='login__blobs'>
          <span className='blob blob--blue-lg' />
          <span className='blob blob--red-lg' />
          <span className='blob blob--blue-sm' />
        </div>

        <img src='/brand/login-bg.svg' alt='Marca' />
      </div>

      {/* Form / Right */}
      <div className='login__form-wrapper'>
        <div className='login__blobs'>
          <span className='blob blob--blue-lg' />
          <span className='blob blob--red-lg' />
          <span className='blob blob--blue-sm' />
        </div>

        <form className='login__form' onSubmit={handleSubmit(submit)}>
          <div className='login__field'>
            <label>Correo electrónico</label>
            <input type='email' placeholder='you@example.com' {...register("email")} />
            {errors.email && <span>{errors.email.message}</span>}
          </div>
          <div className='login__field'>
            <label>Contraseña</label>
            <input type='password' placeholder='••••••••' {...register("password")} />
            {errors.password && <span>{errors.password.message}</span>}
          </div>
          <button type='submit' disabled={isDisabled}>
            {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
};
